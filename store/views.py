from decimal import Decimal, InvalidOperation
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.views import LoginView
from django.db import transaction
from django.db.models import Q
from django.http import Http404
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.views.decorators.http import require_POST
from .cart import SESSION_CART_KEY, cart_details, get_cart
from .forms import CheckoutForm, FeedbackForm, SignUpForm
from .models import Category, Coupon, Order, OrderItem, Outlet, Product

DELIVERY_FEE = Decimal("60.00")
GUEST_ORDERS_SESSION_KEY = "taza_guest_orders"


def active_coupons():
    now = timezone.now()
    return Coupon.objects.filter(active=True).filter(
        Q(starts_at__isnull=True) | Q(starts_at__lte=now),
        Q(ends_at__isnull=True) | Q(ends_at__gte=now),
    )


def home(request):
    categories = Category.objects.filter(is_active=True)
    featured_products = Product.objects.filter(is_available=True, is_featured=True).select_related("category")[:8]
    coupons = active_coupons().order_by("code")[:3]
    offer_styles = {
        "WELCOME10": ("FIRST ORDER OFFER", "A little extra joy in every bite.", "banner-one"),
        "FAMILYFEAST": ("FAMILY TIME", "Make room for one more slice.", "banner-two"),
        "TAZA50": ("TAZA FAVOURITE", "Make your next meal a Taza meal.", "banner-three"),
    }
    banners = []
    for coupon in coupons:
        eyebrow, title, style = offer_styles.get(
            coupon.code,
            ("CURRENT OFFER", coupon.description or f"Save with {coupon.code}.", "banner-three"),
        )
        banners.append({
            "eyebrow": eyebrow,
            "title": title,
            "detail": coupon.description or "Add this code at checkout to redeem your offer.",
            "code": coupon.code,
            "class": style,
        })
    return render(request, "store/home.html", {"categories": categories, "featured_products": featured_products, "banners": banners})


def menu(request):
    requested_mode = request.GET.get("mode", "").upper()
    if requested_mode in {Order.DELIVERY, Order.DINE_IN}:
        request.session["taza_fulfilment"] = requested_mode
    products = Product.objects.filter(is_available=True).select_related("category")
    category_slug = request.GET.get("category", "")
    search = request.GET.get("q", "").strip()
    if category_slug:
        products = products.filter(category__slug=category_slug)
    if search:
        products = products.filter(name__icontains=search) | products.filter(description__icontains=search)
    return render(request, "store/menu.html", {
        "products": products.distinct(),
        "categories": Category.objects.filter(is_active=True),
        "active_category": category_slug,
        "search_query": search,
    })


@require_POST
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id, is_available=True)
    cart = get_cart(request)
    try:
        quantity = int(request.POST.get("quantity", "1"))
    except (TypeError, ValueError):
        quantity = 1
    quantity = max(1, min(quantity, 20))
    cart[str(product.id)] = min(50, cart.get(str(product.id), 0) + quantity)
    request.session[SESSION_CART_KEY] = cart
    messages.success(request, f"{product.name} added to your cart.")
    next_url = request.POST.get("next")
    return redirect(next_url if next_url in {"/menu/", "/", "/cart/"} else "menu")


def cart_page(request):
    items, subtotal = cart_details(request)
    mode = request.session.get("taza_fulfilment", Order.DELIVERY)
    delivery_fee = DELIVERY_FEE if items and mode == Order.DELIVERY else Decimal("0.00")
    fee_label = "Estimated delivery" if mode == Order.DELIVERY else "Dine-in fee"
    return render(request, "store/cart.html", {"items": items, "subtotal": subtotal, "delivery_fee": delivery_fee, "total": subtotal + delivery_fee, "fee_label": fee_label})


@require_POST
def update_cart(request, product_id):
    cart = get_cart(request)
    try:
        quantity = int(request.POST.get("quantity", "1"))
    except (TypeError, ValueError):
        quantity = 1
    if quantity <= 0:
        cart.pop(str(product_id), None)
    else:
        cart[str(product_id)] = min(quantity, 50)
    request.session[SESSION_CART_KEY] = cart
    return redirect("cart")


@require_POST
def remove_cart_item(request, product_id):
    cart = get_cart(request)
    cart.pop(str(product_id), None)
    request.session[SESSION_CART_KEY] = cart
    messages.info(request, "Item removed from your cart.")
    return redirect("cart")


def outlets(request):
    mode = request.GET.get("mode", "DINE_IN").upper()
    if mode not in {Order.DINE_IN, Order.DELIVERY}:
        mode = Order.DINE_IN
    return render(request, "store/outlets.html", {
        "mode": mode,
        "outlets": Outlet.objects.filter(is_active=True),
    })


@require_POST
def select_outlet(request, outlet_id):
    outlet = get_object_or_404(Outlet, id=outlet_id, is_active=True)
    mode = request.POST.get("mode", Order.DINE_IN).upper()
    if mode not in {Order.DINE_IN, Order.DELIVERY}:
        mode = Order.DINE_IN
    request.session["taza_selected_outlet"] = outlet.id
    request.session["taza_fulfilment"] = mode
    messages.success(request, f"{outlet.name} selected.")
    if get_cart(request):
        return redirect("checkout")
    return redirect("menu")


def checkout(request):
    items, subtotal = cart_details(request)
    if not items:
        messages.warning(request, "Your cart is empty. Choose some favourites first.")
        return redirect("menu")

    selected_outlet_id = request.session.get("taza_selected_outlet")
    selected_mode = request.session.get("taza_fulfilment", Order.DELIVERY)
    form = CheckoutForm(
        request.POST or None,
        selected_outlet_id=selected_outlet_id,
        selected_mode=selected_mode,
    )
    delivery_fee = DELIVERY_FEE
    discount = Decimal("0.00")
    if request.method == "POST" and form.is_valid():
        mode = form.cleaned_data["fulfilment"]
        outlet = form.cleaned_data["outlet"]
        address = form.cleaned_data["delivery_address"].strip()
        if mode == Order.DINE_IN and outlet is None:
            form.add_error("outlet", "Please select an outlet for dine-in.")
        elif mode == Order.DELIVERY and not address:
            form.add_error("delivery_address", "Please enter your delivery address.")
        else:
            coupon = None
            coupon_code = form.cleaned_data["coupon_code"].strip().upper()
            if coupon_code:
                try:
                    candidate = Coupon.objects.get(code__iexact=coupon_code)
                    if candidate.is_valid(subtotal):
                        coupon = candidate
                        discount = candidate.calculate_discount(subtotal)
                    else:
                        form.add_error("coupon_code", "That coupon is not valid for this order.")
                except Coupon.DoesNotExist:
                    form.add_error("coupon_code", "Coupon code not found.")
                if form.errors:
                    return render(request, "store/checkout.html", {
                        "form": form,
                        "items": items,
                        "subtotal": subtotal,
                        "delivery_fee": delivery_fee,
                    })
            actual_delivery_fee = delivery_fee if mode == Order.DELIVERY else Decimal("0.00")
            total = max(Decimal("0.00"), subtotal + actual_delivery_fee - discount)
            with transaction.atomic():
                order = Order.objects.create(
                    customer=request.user if request.user.is_authenticated else None,
                    customer_name=form.cleaned_data["customer_name"],
                    phone=form.cleaned_data["phone"],
                    fulfilment=mode,
                    outlet=outlet if mode == Order.DINE_IN or outlet else None,
                    delivery_address=address if mode == Order.DELIVERY else "",
                    special_instructions=form.cleaned_data["special_instructions"],
                    coupon=coupon,
                    coupon_code=coupon.code if coupon else "",
                    subtotal=subtotal,
                    delivery_fee=actual_delivery_fee,
                    discount=discount,
                    total=total,
                    status=Order.CONFIRMED,
                )
                OrderItem.objects.bulk_create([
                    OrderItem(
                        order=order,
                        product=item["product"],
                        product_name=item["product"].name,
                        unit_price=item["product"].price,
                        quantity=item["quantity"],
                    )
                    for item in items
                ])
            if not request.user.is_authenticated:
                guest_orders = request.session.get(GUEST_ORDERS_SESSION_KEY, [])
                if not isinstance(guest_orders, list):
                    guest_orders = []
                request.session[GUEST_ORDERS_SESSION_KEY] = (guest_orders + [order.order_number])[-20:]
            request.session[SESSION_CART_KEY] = {}
            request.session.pop("taza_selected_outlet", None)
            request.session.pop("taza_fulfilment", None)
            messages.success(request, "Your order has been placed. Choose a payment option to continue.")
            return redirect("order_confirmed", order_number=order.order_number)

    return render(request, "store/checkout.html", {
        "form": form,
        "items": items,
        "subtotal": subtotal,
        "delivery_fee": delivery_fee,
    })


def get_order_or_404(order_number):
    return get_object_or_404(Order.objects.prefetch_related("items").select_related("outlet"), order_number=order_number)


def get_order_for_request(request, order_number):
    order = get_order_or_404(order_number)
    if order.customer_id:
        if not request.user.is_authenticated or order.customer_id != request.user.id:
            raise Http404
    else:
        guest_orders = request.session.get(GUEST_ORDERS_SESSION_KEY, [])
        if not isinstance(guest_orders, list) or order_number not in guest_orders:
            raise Http404
    return order


def order_confirmed(request, order_number):
    order = get_order_for_request(request, order_number)
    return render(request, "store/order_confirmed.html", {"order": order})


@require_POST
def choose_payment(request, order_number):
    order = get_order_for_request(request, order_number)
    if order.payment_status == "PAID":
        messages.info(request, "Payment has already been recorded for this order.")
        return redirect("order_confirmed", order_number=order.order_number)
    if order.status in {Order.CANCELLED, Order.COMPLETED}:
        messages.error(request, "Payment cannot be changed for a completed or cancelled order.")
        return redirect("order_confirmed", order_number=order.order_number)
    method = request.POST.get("payment_method", "").upper()
    valid_methods = {choice[0] for choice in Order.PAYMENT_CHOICES}
    if method not in valid_methods:
        messages.error(request, "Please select a valid payment option.")
        return redirect("payment", order_number=order.order_number)
    if order.fulfilment == Order.DINE_IN and method == Order.CASH:
        method = Order.OUTLET
    if order.fulfilment == Order.DELIVERY and method == Order.OUTLET:
        messages.error(request, "Pay at outlet is available for dine-in orders only.")
        return redirect("payment", order_number=order.order_number)
    order.payment_method = method
    # This is a local demonstration only. No payment processor or real money is involved.
    if method in {Order.BKASH_DEMO, Order.CARD_DEMO}:
        order.payment_status = "PAID"
        order.status = Order.CONFIRMED
    else:
        order.payment_status = "PENDING"
    order.save()
    messages.success(request, "Demo payment recorded." if method in {Order.BKASH_DEMO, Order.CARD_DEMO} else "Payment option saved.")
    return redirect("order_confirmed", order_number=order.order_number)


def payment(request, order_number):
    order = get_order_for_request(request, order_number)
    if order.payment_status == "PAID":
        messages.info(request, "Payment has already been recorded for this order.")
        return redirect("order_confirmed", order_number=order.order_number)
    if order.status in {Order.CANCELLED, Order.COMPLETED}:
        messages.error(request, "Payment cannot be changed for a completed or cancelled order.")
        return redirect("order_confirmed", order_number=order.order_number)
    return render(request, "store/payment.html", {"order": order})


@login_required
def order_history(request):
    orders = Order.objects.filter(customer=request.user).select_related("outlet").prefetch_related("items")
    return render(request, "store/order_history.html", {"orders": orders})


def signup(request):
    form = SignUpForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        user = form.save()
        login(request, user)
        messages.success(request, "Welcome to Taza Food Corner!")
        return redirect("home")
    return render(request, "store/signup.html", {"form": form})


def offers(request):
    coupons = active_coupons().order_by("code")
    return render(request, "store/offers.html", {"coupons": coupons})


def coupons(request):
    return render(request, "store/coupons.html", {"coupons": active_coupons()})


def feedback(request):
    form = FeedbackForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Thank you. Your feedback has been received.")
        return redirect("feedback")
    return render(request, "store/feedback.html", {"form": form})


def faq(request):
    return render(request, "store/faq.html")


def contact(request):
    return render(request, "store/contact.html")


def about(request):
    return render(request, "store/about.html")


def opening_hours(request):
    return render(request, "store/opening_hours.html", {"outlets": Outlet.objects.filter(is_active=True)})


def staff_required(user):
    return user.is_authenticated and user.is_staff


@user_passes_test(staff_required)
def staff_dashboard(request):
    if request.method == "POST":
        order = get_object_or_404(Order, id=request.POST.get("order_id"))
        new_status = request.POST.get("status")
        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save(update_fields=["status", "updated_at"])
            messages.success(request, f"Order {order.order_number} updated.")
        return redirect("staff_dashboard")
    orders = Order.objects.select_related("outlet").prefetch_related("items")[:80]
    return render(request, "store/staff_dashboard.html", {"orders": orders, "status_choices": Order.STATUS_CHOICES})


@user_passes_test(staff_required)
def delivery_dashboard(request):
    if request.method == "POST":
        order = get_object_or_404(Order, id=request.POST.get("order_id"), fulfilment=Order.DELIVERY)
        new_status = request.POST.get("status")
        if new_status in {Order.OUT_FOR_DELIVERY, Order.COMPLETED}:
            order.status = new_status
            order.save(update_fields=["status", "updated_at"])
            messages.success(request, f"Delivery status updated for {order.order_number}.")
        return redirect("delivery_dashboard")
    orders = Order.objects.filter(fulfilment=Order.DELIVERY).exclude(status__in=[Order.COMPLETED, Order.CANCELLED])[:80]
    return render(request, "store/delivery_dashboard.html", {"orders": orders})
