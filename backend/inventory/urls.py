from django.urls import path
from .views import ProductList, ProductDetail, BlackListTokenUpdateView

app_name = 'inventory'

urlpatterns = [
    # Product endpoints
    path('', ProductList.as_view(), name='product_list_create'),
    path('product/<int:pk>/', ProductDetail.as_view(), name='product_detail'),

    # Authentication endpoints
    path('logout/blacklist/', BlackListTokenUpdateView.as_view(), name='blacklist_token'),
]