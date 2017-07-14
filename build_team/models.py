from django.db import models

# Create your models here.
class LiveInfo(models.Model):
	name = models.CharField(max_length=64)
	group = models.CharField(max_length=16)
	attribute = models.CharField(max_length=16)
	difficulty = models.CharField(max_length=16)
	cover_url = models.CharField(max_length=256)
	json_url = models.CharField(max_length=256)
	def __str__(self):
		return ' '.join([self.group, self.name, self.difficulty, self.attribute])