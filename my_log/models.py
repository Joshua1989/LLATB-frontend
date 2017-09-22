from django.db import models

class Counter(models.Model):                
    TeamCount = models.PositiveIntegerField(default=0)