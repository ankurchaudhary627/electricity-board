from django.urls import path
from .views import (
  ApplicantApiView,
  ConnectionApplicationRequestApiView
)

urlpatterns = [
  path('api/applicant/<int:applicant_id>', ApplicantApiView.as_view()),
  path('api/connection_request/<int:applicant_id>', ConnectionApplicationRequestApiView.as_view())
]