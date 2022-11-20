from ..models import *

import csv
import datetime

FILE_PATH = 'electricity_board/data_dump/electricity_board_case_study.csv'

# python manage.py runscript load_electricity_data_from_csv_dump
# ConnectionApplicationRequest.objects.all().delete()
# Applicant.objects.all().delete()
# Reviewer.objects.all().delete()

def parse_date(date):
  if not date:
    return None
  return datetime.datetime.strptime(date, "%d-%m-%Y").strftime("%Y-%m-%d")

def get_district(district_name):
  return District.objects.get(name = district_name)

def get_state(state_name):
  return State.objects.get(name = state_name)

def get_connection_status(status):
  return ConnectionStatus.objects.get(status = status)

def get_connection_category(category):
  return ConnectionCategory.objects.get(category = category)

def get_govt_id_type(type):
  return GovtIdType.objects.get(type = type)

def get_ownership(type):
  return Ownership.objects.get(type = type)

def get_reviewer(reviewer_id):
  try:
    return Reviewer.objects.get(reviewer_id=reviewer_id)
  except Reviewer.DoesNotExist:
    return None

def populate_applicant_data(name, gender, pincode, district, state, ownership):
  applicant = Applicant(
    name = name,
    gender = gender,
    pincode = pincode,
    district = district,
    state = state,
    ownership = ownership
  )
  applicant.save()
  return applicant

def populate_reviewer_data(reviewer_name, reviewer_id):
  reviewer = Reviewer(
    reviewer_id = reviewer_id,
    name = reviewer_name
  )
  reviewer.save()
  return reviewer

def populate_connection_application_request_data(govt_id_number, load_applied, applied_on, approved_on, updated_at, comment, connection_category, govt_id_used, applicant, status, reviewer):
  connection_application_request = ConnectionApplicationRequest(
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
  connection_application_request.save()

def process_row(row):
  # Applicant's data
  applicant_name = row['Applicant_Name']
  gender = row['Gender']
  pincode = row['Pincode']
  district = get_district(row['District'].upper())
  state = get_state(row['State'].upper())
  ownership = get_ownership(row['Ownership'].upper())

  # Reviewer data
  reviewer_name = row['Reviewer_Name']
  reviewer_id = int(row['Reviewer_ID'])

  # Connection Application Request data
  govt_id_number = row['ID_Number']
  load_applied = int(row['Load_Applied (in KV)'])
  applied_on = parse_date(row['Date_of_Application'])
  approved_on = parse_date(row['Date_of_Approval'])
  updated_at = parse_date(row['Modified_Date'])
  comment = row['Reviewer_Comments']
  connection_category = get_connection_category(row['Category'].upper())
  govt_id_used = get_govt_id_type(row['GovtID_Type'].upper())
  status = get_connection_status(row['Status'].upper())
  reviewer = get_reviewer(reviewer_id)

  applicant = populate_applicant_data(applicant_name, gender, pincode, district, state, ownership)
  if not reviewer:
    reviewer = populate_reviewer_data(reviewer_name, reviewer_id)
  
  populate_connection_application_request_data(
    govt_id_number,
    load_applied,
    applied_on,
    approved_on,
    updated_at,
    comment,
    connection_category,
    govt_id_used,
    applicant,
    status,
    reviewer
  )

def run():
  with open(FILE_PATH, encoding='utf8') as file:
    reader = csv.DictReader(file)

    ConnectionApplicationRequest.objects.all().delete()
    Applicant.objects.all().delete()
    Reviewer.objects.all().delete()

    total_count = 0
    for row in reader:
      try:
        process_row(row)
        total_count += 1
      except Exception as e:
        print("Error in saving record with row->" + row[list(row.keys())[0]])
        print(e)
    print("Total rows processed =", total_count)