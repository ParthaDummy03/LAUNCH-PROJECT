def cart_summary(request):
    cart = request.session.get("taza_cart", {})
    count = 0
    if not isinstance(cart, dict):
        return {"cart_count": count}
    for quantity in cart.values():
        try:
            count += min(50, max(0, int(quantity)))
        except (TypeError, ValueError):
            continue
    return {"cart_count": count}
