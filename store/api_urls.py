from django.urls import path
from . import api_views

urlpatterns = [
    path("weather/", api_views.weather_api, name="api_weather"),
    path("chat/", api_views.chat_api, name="api_chat"),
    path("outlets/nearby/", api_views.nearby_outlets, name="api_nearby_outlets"),
    path("products/", api_views.products_api, name="api_products"),
    path("orders/", api_views.my_orders_api, name="api_my_orders"),
]
