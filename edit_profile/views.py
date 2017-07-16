from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import time, sys, urllib.request
from mysite import settings
sys.path.append(settings.BASE_DIR)
from llatb import GameData, Live, DefaultLive, MFLive, TeamBuilder, html_view

from my_log.models import Counter

# Create your views here.
def index(request):
	return render(request, 'edit_profile.html')