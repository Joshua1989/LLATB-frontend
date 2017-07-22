from django.conf.urls import url

from . import views
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^calculate', views.calculate, name='calculate'),
    url(r'^live_stats', views.live_stats, name='live_stats'),
    url(r'^edit', views.edit_team, name='edit_team'),
    url(r'^tutorial', TemplateView.as_view(template_name='tutorial_team_strength.html')),
]