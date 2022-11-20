from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class State(models.Model):
  name = models.CharField(blank=False, max_length=20)

  def __str__(self):
    return self.name

class District(models.Model):
  name = models.CharField(blank=False, max_length=20)
  state = models.ForeignKey(State, blank=False, on_delete=models.CASCADE)

  def __str__(self):
    return self.name

class ConnectionStatus(models.Model):
  status = models.CharField(blank=False, max_length=20)
  
  def __str__(self):
    return self.status

class ConnectionCategory(models.Model):
  category = models.CharField(blank=False, max_length=20)

  def __str__(self):
    return self.category

class GovtIdType(models.Model):
  type = models.CharField(blank=False, max_length=20)

  def __str__(self):
    return self.type

class Ownership(models.Model):
  type = models.CharField(blank=False, max_length=20)

  def __str__(self):
    return self.type

class Reviewer(models.Model):
  reviewer_id = models.PositiveIntegerField(blank=False, validators=[MinValueValidator(1)])
  name = models.CharField(blank=False, max_length=20)

  def __str__(self):
    return self.name

class Applicant(models.Model):
  name = models.CharField(blank=False, max_length=20)
  gender = models.CharField(blank=False, max_length=10)
  pincode = models.CharField(blank=False, max_length=10)
  district = models.ForeignKey(District, blank=False, on_delete=models.PROTECT)
  state = models.ForeignKey(State, blank=False, on_delete=models.PROTECT)
  ownership = models.ForeignKey(Ownership, blank=False, on_delete=models.PROTECT)

  def __str__(self):
    return self.name

class ConnectionApplicationRequest(models.Model):
  govt_id_number = models.CharField(blank=False, max_length=20)
  load_applied = models.PositiveIntegerField(blank=True, validators=[MinValueValidator(1), MaxValueValidator(200)])
  applied_on = models.DateField(blank=False)
  approved_on = models.DateField(blank=True, default=None, null=True)
  updated_at = models.DateField(blank=False)
  active = models.BooleanField(default=True, blank=False)
  comment = models.CharField(blank=False, max_length=250)
  connection_category = models.ForeignKey(ConnectionCategory, blank=False, on_delete=models.PROTECT)
  govt_id_used = models.ForeignKey(GovtIdType, blank=False, on_delete=models.PROTECT)
  applicant = models.ForeignKey(Applicant, blank=False, on_delete=models.PROTECT)
  status = models.ForeignKey(ConnectionStatus, blank=False, on_delete=models.PROTECT)
  reviewer = models.ForeignKey(Reviewer, blank=False, on_delete=models.PROTECT)

  def __str__(self):
    return "Connection application request " + str(self.id)