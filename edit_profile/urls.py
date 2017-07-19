from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^en', views.edit_profile_en, name='edit_profile_en'),
]