from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^calculate', views.calculate, name='calculate'),
    url(r'^live_stats', views.live_stats, name='live_stats'),
]