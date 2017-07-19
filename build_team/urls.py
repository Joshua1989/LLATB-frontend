from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^en', views.build_team_en, name='build_team_en'),
    url(r'^calculate', views.calculate, name='calculate'),
    url(r'^live_stats', views.live_stats, name='live_stats'),
    url(r'^receive_user_json', views.receive_user_json, name='receive_user_json'),
    url(r'^LLproxy_user_json', views.LLproxy_user_json, name='LLproxy_user_json'),
]