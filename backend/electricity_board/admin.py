from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register([
  State,
  District,
  ConnectionStatus,
  ConnectionCategory,
  GovtIdType,
  Ownership,
  Reviewer,
  Applicant,
  ConnectionApplicationRequest
])