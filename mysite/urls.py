"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from django.contrib import admin
from . import teambuilderApp

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', teambuilderApp.index),
    url(r'^old_ver/', teambuilderApp.old_UI),
    url(r'^build_team/', include('build_team.urls')),
    url(r'^edit_profile/', include('edit_profile.urls')),
    url(r'^team_strength/', include('team_strength.urls')),
    url(r'^doc/cn/', TemplateView.as_view(template_name='theoretical_material.html')),
    url(r'^doc/en/', TemplateView.as_view(template_name='theoretical_material_en.html')),
    url(r'^tutorial/cn/', TemplateView.as_view(template_name='tutorial_cn.html')),
    url(r'^tutorial/en/', TemplateView.as_view(template_name='tutorial_en.html')),
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico')),
    url(r'^apple-touch-icon\.png$', RedirectView.as_view(url='/static/apple-touch-icon.png'))
]