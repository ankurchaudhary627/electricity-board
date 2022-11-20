from rest_framework import serializers
from .models import *

class DistrctSerializer(serializers.ModelSerializer):
  class Meta:
    model = District
    fields = ('name', 'state')

class ApplicantSerializer(serializers.ModelSerializer):
  state = serializers.SlugRelatedField(read_only=True, slug_field='name')
  district = serializers.SlugRelatedField(read_only=True, slug_field='name')
  ownership = serializers.SlugRelatedField(read_only=True, slug_field='type')

  class Meta:
    model = Applicant
    fields = ('name', 'gender', 'pincode', 'district', 'state', 'ownership')

class ConnectionApplicationRequestSerializer(serializers.ModelSerializer):
  connection_category = serializers.SlugRelatedField(read_only=True, slug_field='category')
  govt_id_used = serializers.SlugRelatedField(read_only=True, slug_field='type')
  status = serializers.SlugRelatedField(read_only=True, slug_field='status')
  reviewer = serializers.SlugRelatedField(read_only=True, slug_field='name')

  class Meta:
    model = ConnectionApplicationRequest
    fields = [
      'govt_id_number',
      'load_applied',
      'applied_on',
      'approved_on',
      'updated_at',
      'active',
      'comment',
      'connection_category',
      'govt_id_used',
      'status',
      'reviewer'
    ]

class CreateConnectionApplicationRequestSerializer(serializers.ModelSerializer):
  connection_category = serializers.SlugRelatedField(read_only=True,slug_field='id')
  status = serializers.SlugRelatedField(read_only=True,slug_field='id')
  reviewer = serializers.SlugRelatedField(read_only=True,slug_field='reviewer_id')

  class Meta:
    model = ConnectionApplicationRequest
    fields = (
      'load_applied',
      'approved_on',
      'comment',
      'connection_category',
      'status',
      'reviewer',
    )