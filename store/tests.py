from decimal import Decimal
from datetime import timedelta
from django.test import Client, TestCase
from django.urls import reverse
from django.utils import timezone
from .api_views import distance_km
from .models import Category, Product, Outlet, Order, Coupon


class TazaWebsiteTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Burgers", slug="burgers", sort_order=1)
        self.product = Product.objects.create(
            category=self.category,
            name="Taza Test Burger",
            slug="taza-test-burger",
            description="Test menu item",
            price=Decimal("250.00"),
            unit_label="piece",
            is_available=True,
            is_featured=True,
        )
        self.outlet = Outlet.objects.create(
            name="Taza Test Outlet",
            address="Test address",
            area="Test area",
            phone="01000000000",
            latitude=Decimal("22.356900"),
            longitude=Decimal("91.783200"),
            opening_hours="10:00 AM – 10:00 PM",
            is_active=True,
            is_demo=True,
        )

    def test_home_page_loads(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "TAZA FOOD CORNER")

    def test_public_pages_render(self):
        for route in (
            "home", "menu", "cart", "outlets", "offers", "coupons", "feedback",
            "faq", "contact", "about", "opening_hours", "signup", "login",
        ):
            with self.subTest(route=route):
                self.assertEqual(self.client.get(reverse(route)).status_code, 200)

    def test_products_api_returns_active_item(self):
        response = self.client.get(reverse("api_products"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["count"], 1)
        self.assertEqual(response.json()["results"][0]["name"], "Taza Test Burger")

    def test_nearby_api_returns_distance(self):
        response = self.client.get(reverse("api_nearby_outlets"), {
            "lat": "22.3569", "lng": "91.7832", "radius": "10"
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["count"], 1)
        self.assertEqual(response.json()["results"][0]["distance_km"], 0.0)

    def test_distance_calculation(self):
        self.assertAlmostEqual(distance_km(22.0, 91.0, 22.0, 91.0), 0.0, places=5)

    def test_guest_can_add_item_to_cart(self):
        response = self.client.post(reverse("add_to_cart", args=[self.product.id]), {
            "quantity": "2", "next": "/menu/"
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(self.client.session["taza_cart"][str(self.product.id)], 2)
        cart_response = self.client.get(reverse("cart"))
        self.assertEqual(cart_response.status_code, 200)
        self.assertContains(cart_response, "Taza Test Burger")

    def test_guest_can_place_delivery_order(self):
        self.client.post(reverse("add_to_cart", args=[self.product.id]), {
            "quantity": "1", "next": "/menu/"
        })
        response = self.client.post(reverse("checkout"), {
            "customer_name": "Test Customer",
            "phone": "01700000000",
            "fulfilment": Order.DELIVERY,
            "delivery_address": "Test Road, Chattogram",
            "coupon_code": "",
            "special_instructions": "",
        })
        self.assertEqual(response.status_code, 302)
        order = Order.objects.get(customer_name="Test Customer")
        self.assertEqual(order.total, Decimal("310.00"))
        self.assertEqual(order.items.count(), 1)

    def test_guest_order_pages_are_private_to_the_ordering_session(self):
        self.client.post(reverse("add_to_cart", args=[self.product.id]), {"quantity": "1"})
        self.client.post(reverse("checkout"), {
            "customer_name": "Test Customer",
            "phone": "01700000000",
            "fulfilment": Order.DELIVERY,
            "delivery_address": "Test Road, Chattogram",
            "coupon_code": "",
            "special_instructions": "",
        })
        order = Order.objects.get(customer_name="Test Customer")
        confirmation_url = reverse("order_confirmed", args=[order.order_number])
        payment_url = reverse("payment", args=[order.order_number])
        self.assertEqual(self.client.get(confirmation_url).status_code, 200)

        other_client = Client()
        self.assertEqual(other_client.get(confirmation_url).status_code, 404)
        self.assertEqual(other_client.get(payment_url).status_code, 404)
        self.assertEqual(other_client.post(reverse("choose_payment", args=[order.order_number]), {
            "payment_method": "CARD_DEMO",
        }).status_code, 404)
        order.refresh_from_db()
        self.assertEqual(order.payment_status, "PENDING")

    def test_cancelled_order_cannot_be_reactivated_by_demo_payment(self):
        self.client.post(reverse("add_to_cart", args=[self.product.id]), {"quantity": "1"})
        self.client.post(reverse("checkout"), {
            "customer_name": "Cancelled Customer",
            "phone": "01700000000",
            "fulfilment": Order.DELIVERY,
            "delivery_address": "Test Road, Chattogram",
            "coupon_code": "",
            "special_instructions": "",
        })
        order = Order.objects.get(customer_name="Cancelled Customer")
        order.status = Order.CANCELLED
        order.save(update_fields=["status", "updated_at"])
        response = self.client.post(reverse("choose_payment", args=[order.order_number]), {
            "payment_method": "CARD_DEMO",
        })
        self.assertRedirects(response, reverse("order_confirmed", args=[order.order_number]))
        order.refresh_from_db()
        self.assertEqual(order.status, Order.CANCELLED)
        self.assertEqual(order.payment_status, "PENDING")

    def test_selecting_dine_in_outlet_without_cart_continues_to_menu(self):
        response = self.client.post(reverse("select_outlet", args=[self.outlet.id]), {"mode": Order.DINE_IN})
        self.assertRedirects(response, reverse("menu"))
        self.assertEqual(self.client.session["taza_selected_outlet"], self.outlet.id)
        self.assertEqual(self.client.session["taza_fulfilment"], Order.DINE_IN)

    def test_dine_in_flow_keeps_selected_outlet_and_charges_no_delivery_fee(self):
        self.client.post(reverse("select_outlet", args=[self.outlet.id]), {"mode": Order.DINE_IN})
        self.client.post(reverse("add_to_cart", args=[self.product.id]), {"quantity": "1"})
        response = self.client.post(reverse("checkout"), {
            "customer_name": "Dine In Customer",
            "phone": "01700000000",
            "fulfilment": Order.DINE_IN,
            "outlet": self.outlet.id,
            "delivery_address": "",
            "coupon_code": "",
            "special_instructions": "",
        })
        self.assertEqual(response.status_code, 302)
        order = Order.objects.get(customer_name="Dine In Customer")
        self.assertEqual(order.outlet, self.outlet)
        self.assertEqual(order.delivery_fee, Decimal("0.00"))
        self.assertEqual(order.total, Decimal("250.00"))

    def test_invalid_coupon_keeps_order_at_checkout(self):
        self.client.post(reverse("add_to_cart", args=[self.product.id]), {"quantity": "1"})
        response = self.client.post(reverse("checkout"), {
            "customer_name": "Test Customer",
            "phone": "01700000000",
            "fulfilment": Order.DELIVERY,
            "delivery_address": "Test Road, Chattogram",
            "coupon_code": "DOESNOTEXIST",
            "special_instructions": "",
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Coupon code not found.")
        self.assertFalse(Order.objects.exists())

    def test_coupon_pages_hide_not_yet_active_and_expired_coupons(self):
        Coupon.objects.create(
            code="FUTURE", description="Future coupon", discount_value=Decimal("10"),
            starts_at=timezone.now() + timedelta(days=1),
        )
        Coupon.objects.create(
            code="EXPIRED", description="Expired coupon", discount_value=Decimal("10"),
            ends_at=timezone.now() - timedelta(days=1),
        )
        for route in ("offers", "coupons"):
            response = self.client.get(reverse(route))
            self.assertEqual(response.status_code, 200)
            self.assertNotContains(response, "FUTURE")
            self.assertNotContains(response, "EXPIRED")

    def test_nearby_api_rejects_partial_or_invalid_coordinates(self):
        response = self.client.get(reverse("api_nearby_outlets"), {"lat": "22.3"})
        self.assertEqual(response.status_code, 400)
        response = self.client.get(reverse("api_nearby_outlets"), {"lat": "bad", "lng": "91.7"})
        self.assertEqual(response.status_code, 400)
