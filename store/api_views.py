from math import asin, cos, radians, sin, sqrt
import hashlib
import json
import os
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Outlet, Product, Order


def rate_limited(request, name, limit, window=60):
    remote_addr = request.META.get("REMOTE_ADDR", "unknown")
    address_hash = hashlib.sha256(remote_addr.encode("utf-8")).hexdigest()[:24]
    key = f"taza:rate:{name}:{address_hash}"
    if cache.add(key, 1, timeout=window):
        return False
    try:
        count = cache.incr(key)
    except ValueError:
        cache.set(key, 1, timeout=window)
        return False
    return count > limit


@require_GET
def weather_api(request):
    api_key = os.environ.get("OPENWEATHER_API_KEY", "").strip()
    if not api_key:
        return JsonResponse({"error": "Weather is not configured. Set OPENWEATHER_API_KEY."}, status=503)
    try:
        lat = float(request.GET.get("lat", "22.3569"))
        lon = float(request.GET.get("lon", "91.7832"))
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            raise ValueError
    except (TypeError, ValueError):
        return JsonResponse({"error": "Enter valid latitude and longitude."}, status=400)

    lat, lon = round(lat, 2), round(lon, 2)
    cache_key = f"taza:weather:{lat:.2f}:{lon:.2f}"
    cached_weather = cache.get(cache_key)
    if cached_weather is not None:
        return JsonResponse(cached_weather)
    query = urlencode({"lat": lat, "lon": lon, "appid": api_key, "units": "metric"})
    request_upstream = Request(f"https://api.openweathermap.org/data/2.5/weather?{query}", headers={"User-Agent": "TazaFoodCorner/1.0"})
    try:
        with urlopen(request_upstream, timeout=8) as response:
            weather = json.loads(response.read().decode("utf-8"))
        condition = (weather.get("weather") or [{}])[0]
        temperature = round(float(weather["main"]["temp"]))
        description = condition.get("description", "")
        city = weather.get("name", "Nearby")
    except HTTPError as error:
        return JsonResponse({"error": "Weather provider rejected the request."}, status=502)
    except (URLError, TimeoutError, json.JSONDecodeError, KeyError, IndexError, TypeError, ValueError, AttributeError):
        return JsonResponse({"error": "Weather service is temporarily unavailable."}, status=502)
    result = {
        "temp": temperature,
        "main": condition.get("main", "Clouds"),
        "desc": description,
        "city": city,
    }
    cache.set(cache_key, result, timeout=600)
    return JsonResponse(result)


@require_POST
def chat_api(request):
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        return JsonResponse({"error": "Chat is not configured. Set GROQ_API_KEY."}, status=503)
    try:
        body = json.loads(request.body or b"{}")
        message = str(body.get("message", "")).strip()
        language = str(body.get("language", "en")).lower()
    except (json.JSONDecodeError, AttributeError, UnicodeDecodeError):
        return JsonResponse({"error": "Send a valid JSON message."}, status=400)
    if not message:
        return JsonResponse({"error": "Type a message first."}, status=400)
    if len(message) > 1000:
        return JsonResponse({"error": "Messages must be 1,000 characters or fewer."}, status=400)
    if rate_limited(request, "chat", limit=10):
        return JsonResponse({"error": "Too many messages. Please wait a minute and try again."}, status=429)
    reply_language = "Reply in Bangla." if language == "bn" else "Reply in the language the customer uses."

    payload = json.dumps({
        "model": os.environ.get("GROQ_MODEL", "openai/gpt-oss-20b"),
        "messages": [
            {"role": "system", "content": "You are Taza Food Corner's helpful menu assistant. Answer briefly about food, menu choices, ordering, delivery, and dine-in. Do not invent current prices or availability; direct customers to the website menu for current information. " + reply_language},
            {"role": "user", "content": message},
        ],
        "temperature": 0.5,
        "max_tokens": 250,
    }).encode("utf-8")
    upstream = Request("https://api.groq.com/openai/v1/chat/completions", data=payload, headers={
        "Authorization": f"Bearer {api_key}", "Content-Type": "application/json", "User-Agent": "TazaFoodCorner/1.0",
    }, method="POST")
    try:
        with urlopen(upstream, timeout=20) as response:
            result = json.loads(response.read().decode("utf-8"))
        reply = result["choices"][0]["message"]["content"].strip()
        if not reply:
            raise ValueError("Empty chat response")
    except HTTPError as error:
        if error.code in {401, 403}:
            message = "Groq rejected this API key or its model access. Check the key and enabled models."
        elif error.code == 404:
            message = "The configured Groq model is unavailable. Choose a model enabled for this API key."
        elif error.code == 429:
            message = "The Groq service is rate-limited right now. Please try again shortly."
        else:
            message = "The chat service could not answer right now. Please try again shortly."
        return JsonResponse({"error": message}, status=502)
    except (URLError, TimeoutError, json.JSONDecodeError, KeyError, IndexError, TypeError, ValueError, AttributeError):
        return JsonResponse({"error": "The chat service is temporarily unavailable."}, status=502)
    return JsonResponse({"reply": reply})


def distance_km(lat1, lon1, lat2, lon2):
    radius = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * radius * asin(sqrt(a))


@api_view(["GET"])
@permission_classes([AllowAny])
def nearby_outlets(request):
    has_lat = "lat" in request.query_params
    has_lng = "lng" in request.query_params
    try:
        radius = float(request.query_params.get("radius", "10"))
        if has_lat != has_lng or not (1 <= radius <= 100):
            raise ValueError
        if has_lat:
            lat = float(request.query_params["lat"])
            lng = float(request.query_params["lng"])
            if not (-90 <= lat <= 90 and -180 <= lng <= 180):
                raise ValueError
        else:
            lat = lng = None
    except (KeyError, TypeError, ValueError):
        return Response({"error": "Provide valid latitude/longitude and a radius from 1 to 100 km."}, status=400)

    rows = []
    for outlet in Outlet.objects.filter(is_active=True):
        item = {
            "id": outlet.id,
            "name": outlet.name,
            "address": outlet.address,
            "area": outlet.area,
            "phone": outlet.phone,
            "latitude": float(outlet.latitude),
            "longitude": float(outlet.longitude),
            "opening_hours": outlet.opening_hours,
            "is_demo": outlet.is_demo,
            "distance_km": None,
        }
        if lat is not None:
            item["distance_km"] = round(distance_km(lat, lng, item["latitude"], item["longitude"]), 2)
            if item["distance_km"] > radius:
                continue
        rows.append(item)
    if lat is not None:
        rows.sort(key=lambda row: row["distance_km"])
    return Response({"count": len(rows), "radius_km": radius, "results": rows})


@api_view(["GET"])
@permission_classes([AllowAny])
def products_api(request):
    products = Product.objects.filter(is_available=True).select_related("category")
    category = request.query_params.get("category")
    if category:
        products = products.filter(category__slug=category)
    return Response({"count": products.count(), "results": [
        {"id": p.id, "name": p.name, "slug": p.slug, "category": p.category.name,
         "description": p.description, "price": str(p.price), "unit": p.unit_label,
         "image_url": p.image_url, "featured": p.is_featured}
        for p in products
    ]})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders_api(request):
    orders = Order.objects.filter(customer=request.user).prefetch_related("items")
    return Response({"count": orders.count(), "results": [{
        "order_number": order.order_number,
        "created_at": order.created_at.isoformat(),
        "fulfilment": order.fulfilment,
        "status": order.status,
        "payment_status": order.payment_status,
        "total": str(order.total),
        "items": [{"name": item.product_name, "quantity": item.quantity, "line_total": str(item.line_total)} for item in order.items.all()],
    } for order in orders]})
