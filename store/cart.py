from decimal import Decimal
from .models import Product

SESSION_CART_KEY = "taza_cart"


def get_cart(request):
    raw = request.session.get(SESSION_CART_KEY, {})
    cart = {}
    if isinstance(raw, dict):
        for product_id, quantity in raw.items():
            try:
                pid, qty = str(int(product_id)), int(quantity)
                if qty > 0:
                    cart[pid] = min(qty, 50)
            except (TypeError, ValueError):
                continue
    request.session[SESSION_CART_KEY] = cart
    return cart


def cart_details(request):
    cart = get_cart(request)
    products = Product.objects.filter(id__in=cart.keys(), is_available=True).select_related("category")
    items = []
    subtotal = Decimal("0.00")
    for product in products:
        quantity = cart.get(str(product.id), 0)
        line_total = product.price * quantity
        subtotal += line_total
        items.append({"product": product, "quantity": quantity, "line_total": line_total})
    # Remove deleted/unavailable products from the session cart.
    valid_ids = {str(item["product"].id) for item in items}
    if set(cart) != valid_ids:
        request.session[SESSION_CART_KEY] = {k: v for k, v in cart.items() if k in valid_ids}
    return items, subtotal
