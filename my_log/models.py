from django.db import models

class Counter(models.Model):                
    TeamCount = models.SmallIntegerField(default=0)