from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from store.models import Category, Product, Outlet, Coupon

class Command(BaseCommand):
    help = "Create sample Taza Food Corner categories, products, outlets and coupons."

    def handle(self, *args, **options):
        category_data = [
            ("Burgers", "burgers", "Juicy favourites, made fresh."),
            ("Pizza", "pizza", "Hot slices for every craving."),
            ("Fried Chicken", "fried-chicken", "Crunchy outside, tender inside."),
            ("Rice & Meals", "rice-meals", "Comfort food for a full meal."),
            ("Drinks", "drinks", "A refreshing finish."),
            ("Desserts", "desserts", "Something sweet to end with."),
        ]
        categories = {}
        for sort_order, (name, slug, description) in enumerate(category_data, 1):
            category, _ = Category.objects.update_or_create(slug=slug, defaults={"name": name, "description": description, "sort_order": sort_order, "is_active": True})
            categories[slug] = category

        product_data = [
            ("Taza Classic Burger", "burgers", "A grilled chicken patty with fresh lettuce and house sauce.", "390.00", "piece", True, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900"),
            ("Double Cheese Burger", "burgers", "Double layers of chicken and melted cheese.", "520.00", "piece", True, "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=900"),
            ("Spicy Chicken Pizza", "pizza", "A shareable pizza with spicy chicken and cheese.", "850.00", "10 inch", True, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900"),
            ("Classic Cheese Pizza", "pizza", "A classic cheese pizza with a crisp crust.", "720.00", "10 inch", False, "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900"),
            ("Crispy Fried Chicken", "fried-chicken", "Golden crispy chicken pieces, freshly prepared.", "260.00", "2 pieces", True, "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=900"),
            ("Chicken Strips", "fried-chicken", "Crunchy chicken strips with dipping sauce.", "320.00", "4 pieces", False, "https://images.unsplash.com/photo-1562967914-608f82629710?w=900"),
            ("Taza Chicken Biryani", "rice-meals", "Fragrant rice served with a tender chicken piece.", "280.00", "plate", True, "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&auto=format&fit=crop&q=85"),
            ("Beef Tehari", "rice-meals", "Traditional-style beef tehari with aromatic spices.", "330.00", "plate", False, "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900"),
            ("Fresh Lime", "drinks", "A chilled citrus drink.", "100.00", "glass", False, "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?w=900"),
            ("Cold Coffee", "drinks", "Creamy iced coffee.", "180.00", "glass", True, "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900"),
            ("Chocolate Brownie", "desserts", "A rich chocolate brownie.", "160.00", "piece", True, "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900"),
            ("Vanilla Ice Cream", "desserts", "Smooth vanilla ice cream.", "120.00", "scoop", False, "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=900"),
        ]
        for name, cat, desc, price, unit, featured, image_url in product_data:
            # Stable slug based on the product name; keeps repeated seed runs idempotent.
            slug = slugify(name)
            # Correct the deliberately generic image URL fallback for the second demo product.
            if name == "Double Cheese Burger":
                image_url = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=900"
            Product.objects.update_or_create(slug=slug, defaults={
                "category": categories[cat], "name": name, "description": desc,
                "price": Decimal(price), "unit_label": unit, "is_featured": featured,
                "is_available": True, "image_url": image_url,
            })

        # These outlets are illustrative demo records centred around Chattogram.
        # Replace their names, addresses, phone numbers and coordinates in Django Admin.
        outlet_data = [
            ("Taza Demo Outlet — GEC", "Demo address near GEC Circle", "GEC Circle", "01XXXXXXXXX", "22.3596", "91.8210"),
            ("Taza Demo Outlet — Agrabad", "Demo address in Agrabad", "Agrabad", "01XXXXXXXXX", "22.3250", "91.8123"),
            ("Taza Demo Outlet — Muradpur", "Demo address near Muradpur", "Muradpur", "01XXXXXXXXX", "22.3590", "91.8000"),
        ]
        for name, address, area, phone, lat, lng in outlet_data:
            Outlet.objects.update_or_create(name=name, defaults={
                "address": address, "area": area, "phone": phone,
                "latitude": Decimal(lat), "longitude": Decimal(lng),
                "opening_hours": "10:00 AM – 10:00 PM", "is_active": True, "is_demo": True,
            })

        coupon_data = [
            ("WELCOME10", "10% off your first order", "PERCENT", "10.00", "300.00"),
            ("TAZA50", "৳50 off orders over ৳500", "FIXED", "50.00", "500.00"),
            ("FAMILYFEAST", "15% off a family meal", "PERCENT", "15.00", "1000.00"),
        ]
        for code, description, dtype, value, minimum in coupon_data:
            Coupon.objects.update_or_create(code=code, defaults={
                "description": description, "discount_type": dtype,
                "discount_value": Decimal(value), "minimum_subtotal": Decimal(minimum), "active": True,
            })

        self.stdout.write(self.style.SUCCESS("Demo data is ready. Replace demo outlet information before using this for real orders."))
