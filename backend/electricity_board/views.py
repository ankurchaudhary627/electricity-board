from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from electricity_board.models import *
from .serializers import *
from django.db import transaction
import datetime

def get_applicant_object(applicant_id):
  try:
    return Applicant.objects.get(id=applicant_id)
  except Applicant.DoesNotExist:
    return None

def get_district_object(district_id):
  try:
    return District.objects.get(id=district_id)
  except District.DoesNotExist:
    return None

def get_connection_application_request_object(applicant_id):
  try:
    return ConnectionApplicationRequest.objects.filter(applicant = applicant_id)
  except ConnectionApplicationRequest.DoesNotExist:
    return None

def get_conn_category_object(conn_category_id):
  try:
    return ConnectionCategory.objects.get(id=conn_category_id)
  except ConnectionCategory.DoesNotExist:
    return None

def get_status_object(status_id):
  try:
    return ConnectionStatus.objects.get(id=status_id)
  except ConnectionStatus.DoesNotExist:
    return None

def get_reviewer_object(reviewer_id):
  try:
    return Reviewer.objects.get(reviewer_id=reviewer_id)
  except Reviewer.DoesNotExist:
    return None

def get_ownership_object(ownership_id):
  try:
    return Ownership.objects.get(id=ownership_id)
  except Ownership.DoesNotExist:
    return None

# Create your views here.
class ApplicantApiView(APIView):

  # Get by applicant id
  def get(self, request, applicant_id, *args, **kwargs):
    applicant_instance = get_applicant_object(applicant_id)
    if not applicant_instance:
      return Response(
        {"res": "Applicant doesn't exists"},
        status=status.HTTP_400_BAD_REQUEST
      )
    serializer = ApplicantSerializer(applicant_instance)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # Update existing record
  def patch(self, request, applicant_id, *args, **kwargs):
    applicant_instance = get_applicant_object(applicant_id)
    if not applicant_instance:
      return Response(
        {"res": "Application doesn't exists"},
        status=status.HTTP_400_BAD_REQUEST
      )
    district_instance = get_district_object(request.data.get('district_id'))
    ownership_instance = get_ownership_object(request.data.get('ownership_id'))
    if district_instance:
      applicant_instance.district = district_instance
    if ownership_instance:
      applicant_instance.ownership = ownership_instance
    if not district_instance and not ownership_instance and not request.data.get('pincode'):
      return Response("request object cannot be blank", status=status.HTTP_400_BAD_REQUEST)
    data = {
      'pincode': request.data.get('pincode') or applicant_instance.pincode
    }
    serializer = ApplicantSerializer(instance=applicant_instance, data=data, partial=True)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConnectionApplicationRequestApiView(APIView):

  def create_new_connection_application_request(self, old_instance, data):
    if not data.get('reviewer') or not data.get('comment') or not data.get('status'):
      return None
    if data.get('load_applied') and not isinstance(data.get('load_applied'), int):
      return None
    conn_category_instance =  get_conn_category_object(data.get('connection_category'))
    status_instance =  get_status_object(data.get('status'))
    reviewer_instance =  get_reviewer_object(data.get('reviewer'))

    # fixed
    govt_id_number = old_instance.govt_id_number
    govt_id_used = old_instance.govt_id_used
    applied_on = old_instance.applied_on

    # mandatory
    comment = data.get('comment')
    reviewer = reviewer_instance
    status = status_instance

    load_applied = old_instance.load_applied if not data.get('load_applied') or data.get('load_applied') > 200 else data.get('load_applied') 
    approved_on = data.get('approved_on') or old_instance.approved_on
    updated_at = datetime.date.today()
    connection_category = conn_category_instance if conn_category_instance else old_instance.connection_category
    applicant = old_instance.applicant
    return ConnectionApplicationRequest(
      govt_id_number = govt_id_number,
      load_applied = load_applied,
      applied_on = applied_on,
      approved_on = approved_on,
      updated_at = updated_at,
      comment = comment,
      connection_category = connection_category,
      govt_id_used = govt_id_used,
      applicant = applicant,
      status = status,
      reviewer = reviewer
    )

  # Get connection requests records by applicant id
  def get(self, request, applicant_id):
    connection_application_request_list = get_connection_application_request_object(applicant_id)
    if not connection_application_request_list:
      return Response(
        {"res": "Connection request doesn't exists"},
        status=status.HTTP_400_BAD_REQUEST
      )
    serializer = ConnectionApplicationRequestSerializer(connection_application_request_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def post(self, request, applicant_id):
    #TODO: to be implemented in future
    return Response(status=status.HTTP_200_OK)


  # Put new connection request, mark latest active to False
  def put(self, request, applicant_id):
    serializer = CreateConnectionApplicationRequestSerializer(data=request.data)
    if serializer.is_valid():
      conn_req_queryset = get_connection_application_request_object(applicant_id)
      if not conn_req_queryset.exists():
        return Response(
          {"res": "Connection request doesn't exists"},
          status=status.HTTP_400_BAD_REQUEST
        )
      with transaction.atomic():
        conn_req = conn_req_queryset.last()
        conn_req.active=False
        conn_req.save(update_fields=['active'])
        new_conn = self.create_new_connection_application_request(conn_req_queryset.last(), request.data)
        print(conn_req)
        new_conn.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
