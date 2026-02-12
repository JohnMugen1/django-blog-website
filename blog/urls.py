from django.urls import path

from .views import (BlogHome, 
                    BlogCreateView,
                    BlogDetailView,
                    BlogUpdateView,
                    BlogDeleteView
                    ) 

urlpatterns = [
    path('post/<int:pk>/delete/', BlogDeleteView.as_view(), name="delete_post"),
    path('post/<int:pk>/edit/', BlogUpdateView.as_view(), name='post_edit'),
    path('post/<int:pk>/', BlogDetailView.as_view(), name='post_detail'),
    path('post/new/', BlogCreateView.as_view(), name='post_new'),
    path('', BlogHome.as_view(),name='home')
]