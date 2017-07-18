from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^calculate', views.calculate, name='calculate'),
    url(r'^live_stats', views.live_stats, name='live_stats'),
    url(r'^receive_user_json', views.receive_user_json, name='receive_user_json'),
]