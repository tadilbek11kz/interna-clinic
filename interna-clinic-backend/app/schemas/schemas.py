from typing import List
from datetime import datetime

from pydantic import BaseModel


class PatientRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    gender: str
    is_on_controlled: str
    age: int
    ethnicity: str
    region: str
    height: int
    weight: int
    BMI: float
    education: str
    marital_status: str
    job_description: str
    driving_status: str
    was_involved_in_car_accidents: str
    cirrhosis: List[str]
    duration_of_illness: int
    platelet_count: float
    hemoglobin_level: float
    ALT: float
    ALT_unit: str
    AAT: float
    AAT_unit: str
    bilirubin: float
    creatinine: float
    INA: float
    albumin: float
    sodium_blood_level: float
    potassium_ion: float
    blood_ammonia: float
    indirect_elastography_of_liver: float
    indirect_elastography_of_spleen: float
    EVV: str
    red_flags_EVV: str
    presence_of_ascites: str
    connection_test_a: float
    connection_test_b: float
    symbol_test: float
    serial_test: float
    line_test: float
    connection_test_a_wrong: str
    connection_test_b_wrong: str
    symbol_test_wrong: str
    serial_test_wrong: str
    line_test_wrong: str
    type_of_encephalopathy: str
    degree_of_encephalopathy: str
    process_of_encephalopathy: str
    presence_of_precipitating_factors: str
    comorbidities: List[str]
    was_planned_hospitalized_with_liver_diseases: str
    number_of_planned_hospitalizations_with_liver_diseases: int
    was_planned_hospitalized_without_liver_diseases: str
    number_of_planned_hospitalizations_without_liver_diseases: int
    was_emergency_hospitalized_with_liver_diseases: str
    number_of_emergency_hospitalizations_with_liver_diseases: int
    was_emergency_hospitalized_without_liver_diseases: str
    number_of_emergency_hospitalizations_without_liver_diseases: int
    hepatocellular_carcinoma: str
    was_injured: str
    GIB: str
    previous_infectious_diseases: List[str]
    stool_character: str
    dehydration: str
    portosystemic_bypass_surgery: str
    thrombosis: List[str]
    medicines: List[str]
    renal_impairment: str
    bad_habits: List[str]
    CP: str
    accepted_PE_medications: str
    accepted_medications_at_the_time_of_inspection: str

    doctor_id: int

    health_condition: str
    last_year_health_condition: str
    physical_activity_a: str
    physical_activity_b: str
    physical_activity_c: str
    physical_activity_d: str
    physical_activity_e: str
    physical_activity_f: str
    physical_activity_g: str
    physical_activity_h: str
    physical_activity_j: str
    physical_activity_k: str
    physical_work_a: str
    physical_work_b: str
    physical_work_c: str
    physical_work_d: str
    emotial_state_a: str
    emotial_state_b: str
    emotial_state_c: str
    family_time: str
    pain: str
    pain_effect: str
    mood_a: str
    mood_b: str
    mood_c: str
    mood_d: str
    mood_e: str
    mood_f: str
    mood_g: str
    mood_h: str
    mood_k: str
    communication: str
    health_condition_a: str
    health_condition_b: str
    health_condition_c: str
    health_condition_d: str


# This Pydantic model is needed for router, because we receive raw 'password' field there.
class PatientCreateRawPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    password: str  # <-- Raw password
    gender: str = "Мужской"
    is_on_controlled: str = "Нет данных"
    age: int
    ethnicity: str = "Азиат"
    region: str = "Алматы"
    height: int
    weight: int
    BMI: float
    education: str = "Среднее"
    marital_status: str = "Не замужем/не женат"
    job_description: str = "Другое"
    driving_status: str = "Да"
    was_involved_in_car_accidents: str = "Нет"
    cirrhosis: List[str]
    duration_of_illness: int
    platelet_count: float
    hemoglobin_level: float
    ALT: float
    ALT_unit: str = "ЕД/Л"
    AAT: float
    AAT_unit: str = "ЕД/Л"
    bilirubin: float
    creatinine: float
    INA: float
    albumin: float
    sodium_blood_level: float
    potassium_ion: float
    blood_ammonia: float
    indirect_elastography_of_liver: float
    indirect_elastography_of_spleen: float
    EVV: str = "Нет данных"
    red_flags_EVV: str = "Нет данных"
    presence_of_ascites: str = "Нет данных"
    connection_test_a: float
    connection_test_b: float
    symbol_test: float
    serial_test: float
    line_test: float
    connection_test_a_wrong: str
    connection_test_b_wrong: str
    symbol_test_wrong: str
    serial_test_wrong: str
    line_test_wrong: str
    type_of_encephalopathy: str
    degree_of_encephalopathy: str
    process_of_encephalopathy: str = "Нет данных"
    presence_of_precipitating_factors: str = "Нет данных"
    comorbidities: List[str]
    was_planned_hospitalized_with_liver_diseases: str = "Нет данных"
    number_of_planned_hospitalizations_with_liver_diseases: int
    was_planned_hospitalized_without_liver_diseases: str = "Нет данных"
    number_of_planned_hospitalizations_without_liver_diseases: int
    was_emergency_hospitalized_with_liver_diseases: str = "Нет данных"
    number_of_emergency_hospitalizations_with_liver_diseases: int
    was_emergency_hospitalized_without_liver_diseases: str = "Нет данных"
    number_of_emergency_hospitalizations_without_liver_diseases: int
    hepatocellular_carcinoma: str = "Нет"
    was_injured: str = "Нет"
    GIB: str = "Нет"
    previous_infectious_diseases: List[str]
    stool_character: str = "Регулярный (1 раз в 1-2 дня)"
    dehydration: str
    portosystemic_bypass_surgery: str = "Нет"
    thrombosis: List[str]
    medicines: List[str]
    renal_impairment: str = "Нет"
    bad_habits: List[str]
    CP: str
    accepted_PE_medications: str
    accepted_medications_at_the_time_of_inspection: str

    doctor_id: int

    health_condition: str
    last_year_health_condition: str
    physical_activity_a: str
    physical_activity_b: str
    physical_activity_c: str
    physical_activity_d: str
    physical_activity_e: str
    physical_activity_f: str
    physical_activity_g: str
    physical_activity_h: str
    physical_activity_j: str
    physical_activity_k: str
    physical_work_a: str
    physical_work_b: str
    physical_work_c: str
    physical_work_d: str
    emotial_state_a: str
    emotial_state_b: str
    emotial_state_c: str
    family_time: str
    pain: str
    pain_effect: str
    mood_a: str
    mood_b: str
    mood_c: str
    mood_d: str
    mood_e: str
    mood_f: str
    mood_g: str
    mood_h: str
    mood_k: str
    communication: str
    health_condition_a: str
    health_condition_b: str
    health_condition_c: str
    health_condition_d: str


# This Pydantic model is needed for service and repository, because we convert raw 'password' field to the
# hashed 'hashed_password' field in the service layer.
class PatientCreateHashedPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    hashed_password: str  # <-- Hashed password
    gender: str
    is_on_controlled: str
    age: int
    ethnicity: str
    region: str
    height: int
    weight: int
    BMI: float
    education: str
    marital_status: str
    job_description: str
    driving_status: str
    was_involved_in_car_accidents: str
    cirrhosis: List[str]
    duration_of_illness: int
    platelet_count: float
    hemoglobin_level: float
    ALT: float
    ALT_unit: str
    AAT: float
    AAT_unit: str
    bilirubin: float
    creatinine: float
    INA: float
    albumin: float
    sodium_blood_level: float
    potassium_ion: float
    blood_ammonia: float
    indirect_elastography_of_liver: float
    indirect_elastography_of_spleen: float
    EVV: str
    red_flags_EVV: str
    presence_of_ascites: str
    connection_test_a: float
    connection_test_b: float
    symbol_test: float
    serial_test: float
    line_test: float
    connection_test_a_wrong: str
    connection_test_b_wrong: str
    symbol_test_wrong: str
    serial_test_wrong: str
    line_test_wrong: str
    type_of_encephalopathy: str
    degree_of_encephalopathy: str
    process_of_encephalopathy: str
    presence_of_precipitating_factors: str
    comorbidities: List[str]
    was_planned_hospitalized_with_liver_diseases: str
    number_of_planned_hospitalizations_with_liver_diseases: int
    was_planned_hospitalized_without_liver_diseases: str
    number_of_planned_hospitalizations_without_liver_diseases: int
    was_emergency_hospitalized_with_liver_diseases: str
    number_of_emergency_hospitalizations_with_liver_diseases: int
    was_emergency_hospitalized_without_liver_diseases: str
    number_of_emergency_hospitalizations_without_liver_diseases: int
    hepatocellular_carcinoma: str
    was_injured: str
    GIB: str
    previous_infectious_diseases: List[str]
    stool_character: str
    dehydration: str
    portosystemic_bypass_surgery: str
    thrombosis: List[str]
    medicines: List[str]
    renal_impairment: str
    bad_habits: List[str]
    CP: str
    accepted_PE_medications: str
    accepted_medications_at_the_time_of_inspection: str

    doctor_id: int

    health_condition: str
    last_year_health_condition: str
    physical_activity_a: str
    physical_activity_b: str
    physical_activity_c: str
    physical_activity_d: str
    physical_activity_e: str
    physical_activity_f: str
    physical_activity_g: str
    physical_activity_h: str
    physical_activity_j: str
    physical_activity_k: str
    physical_work_a: str
    physical_work_b: str
    physical_work_c: str
    physical_work_d: str
    emotial_state_a: str
    emotial_state_b: str
    emotial_state_c: str
    family_time: str
    pain: str
    pain_effect: str
    mood_a: str
    mood_b: str
    mood_c: str
    mood_d: str
    mood_e: str
    mood_f: str
    mood_g: str
    mood_h: str
    mood_k: str
    communication: str
    health_condition_a: str
    health_condition_b: str
    health_condition_c: str
    health_condition_d: str


class PatientUpdateRawPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    password: str
    gender: str = "Мужской"
    is_on_controlled: str = "Нет данных"
    age: int
    ethnicity: str = "Азиат"
    region: str = "Алматы"
    height: int
    weight: int
    BMI: float
    education: str = "Среднее"
    marital_status: str = "Не замужем/не женат"
    job_description: str = "Другое"
    driving_status: str = "Да"
    was_involved_in_car_accidents: str = "Нет"
    cirrhosis: List[str]
    duration_of_illness: int
    platelet_count: float
    hemoglobin_level: float
    ALT: float
    ALT_unit: str = "ЕД/Л"
    AAT: float
    AAT_unit: str = "ЕД/Л"
    bilirubin: float
    creatinine: float
    INA: float
    albumin: float
    sodium_blood_level: float
    potassium_ion: float
    blood_ammonia: float
    indirect_elastography_of_liver: float
    indirect_elastography_of_spleen: float
    EVV: str = "Нет данных"
    red_flags_EVV: str = "Нет данных"
    presence_of_ascites: str = "Нет данных"
    connection_test_a: float
    connection_test_b: float
    symbol_test: float
    serial_test: float
    line_test: float
    connection_test_a_wrong: str
    connection_test_b_wrong: str
    symbol_test_wrong: str
    serial_test_wrong: str
    line_test_wrong: str
    type_of_encephalopathy: str
    degree_of_encephalopathy: str
    process_of_encephalopathy: str = "Нет данных"
    presence_of_precipitating_factors: str = "Нет данных"
    comorbidities: List[str]
    was_planned_hospitalized_with_liver_diseases: str = "Нет данных"
    number_of_planned_hospitalizations_with_liver_diseases: int
    was_planned_hospitalized_without_liver_diseases: str = "Нет данных"
    number_of_planned_hospitalizations_without_liver_diseases: int
    was_emergency_hospitalized_with_liver_diseases: str = "Нет данных"
    number_of_emergency_hospitalizations_with_liver_diseases: int
    was_emergency_hospitalized_without_liver_diseases: str = "Нет данных"
    number_of_emergency_hospitalizations_without_liver_diseases: int
    hepatocellular_carcinoma: str = "Нет"
    was_injured: str = "Нет"
    GIB: str = "Нет"
    previous_infectious_diseases: List[str]
    stool_character: str = "Регулярный (1 раз в 1-2 дня)"
    dehydration: str
    portosystemic_bypass_surgery: str
    thrombosis: List[str]
    medicines: List[str]
    renal_impairment: str = "Нет"
    bad_habits: List[str]
    CP: str
    accepted_PE_medications: str
    accepted_medications_at_the_time_of_inspection: str

    doctor_id: int

    health_condition: str
    last_year_health_condition: str
    physical_activity_a: str
    physical_activity_b: str
    physical_activity_c: str
    physical_activity_d: str
    physical_activity_e: str
    physical_activity_f: str
    physical_activity_g: str
    physical_activity_h: str
    physical_activity_j: str
    physical_activity_k: str
    physical_work_a: str
    physical_work_b: str
    physical_work_c: str
    physical_work_d: str
    emotial_state_a: str
    emotial_state_b: str
    emotial_state_c: str
    family_time: str
    pain: str
    pain_effect: str
    mood_a: str
    mood_b: str
    mood_c: str
    mood_d: str
    mood_e: str
    mood_f: str
    mood_g: str
    mood_h: str
    mood_k: str
    communication: str
    health_condition_a: str
    health_condition_b: str
    health_condition_c: str
    health_condition_d: str


class PatientUpdateHashedPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    hashed_password: str
    gender: str
    is_on_controlled: str
    age: int
    ethnicity: str
    region: str
    height: int
    weight: int
    BMI: float
    education: str
    marital_status: str
    job_description: str
    driving_status: str
    was_involved_in_car_accidents: str
    cirrhosis: List[str]
    duration_of_illness: int
    platelet_count: float
    hemoglobin_level: float
    ALT: float
    ALT_unit: str
    AAT: float
    AAT_unit: str
    bilirubin: float
    creatinine: float
    INA: float
    albumin: float
    sodium_blood_level: float
    potassium_ion: float
    blood_ammonia: float
    indirect_elastography_of_liver: float
    indirect_elastography_of_spleen: float
    EVV: str
    red_flags_EVV: str
    presence_of_ascites: str
    connection_test_a: float
    connection_test_b: float
    symbol_test: float
    serial_test: float
    line_test: float
    connection_test_a_wrong: str
    connection_test_b_wrong: str
    symbol_test_wrong: str
    serial_test_wrong: str
    line_test_wrong: str
    type_of_encephalopathy: str
    degree_of_encephalopathy: str
    process_of_encephalopathy: str
    presence_of_precipitating_factors: str
    comorbidities: List[str]
    was_planned_hospitalized_with_liver_diseases: str
    number_of_planned_hospitalizations_with_liver_diseases: int
    was_planned_hospitalized_without_liver_diseases: str
    number_of_planned_hospitalizations_without_liver_diseases: int
    was_emergency_hospitalized_with_liver_diseases: str
    number_of_emergency_hospitalizations_with_liver_diseases: int
    was_emergency_hospitalized_without_liver_diseases: str
    number_of_emergency_hospitalizations_without_liver_diseases: int
    hepatocellular_carcinoma: str
    was_injured: str
    GIB: str
    previous_infectious_diseases: List[str]
    stool_character: str
    dehydration: str
    portosystemic_bypass_surgery: str
    thrombosis: List[str]
    medicines: List[str]
    renal_impairment: str
    bad_habits: List[str]
    CP: str
    accepted_PE_medications: str
    accepted_medications_at_the_time_of_inspection: str

    doctor_id: int

    health_condition: str
    last_year_health_condition: str
    physical_activity_a: str
    physical_activity_b: str
    physical_activity_c: str
    physical_activity_d: str
    physical_activity_e: str
    physical_activity_f: str
    physical_activity_g: str
    physical_activity_h: str
    physical_activity_j: str
    physical_activity_k: str
    physical_work_a: str
    physical_work_b: str
    physical_work_c: str
    physical_work_d: str
    emotial_state_a: str
    emotial_state_b: str
    emotial_state_c: str
    family_time: str
    pain: str
    pain_effect: str
    mood_a: str
    mood_b: str
    mood_c: str
    mood_d: str
    mood_e: str
    mood_f: str
    mood_g: str
    mood_h: str
    mood_k: str
    communication: str
    health_condition_a: str
    health_condition_b: str
    health_condition_c: str
    health_condition_d: str


class PatientPaginationResult(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int
    data: List[PatientRead]


class DoctorRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    gender: str = "Мужской"
    age: int
    qualification: str = "Гастроэнтеролог"


class DoctorReadFullName(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    qualification: str


class DoctorCreateRawPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    password: str
    gender: str = "Мужской"
    age: int
    qualification: str = "Гастроэнтеролог"


class DoctorCreateHashedPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    hashed_password: str
    gender: str
    age: int
    qualification: str


class DoctorUpdateRawPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    password: str
    gender: str = "Мужской"
    age: int


class DoctorUpdateHashedPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    IIN: str
    hashed_password: str
    gender: str = "Мужской"
    age: int


class DoctorPaginationResult(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int
    data: List[DoctorRead]


class AdminRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    middle_name: str
    username: str


class AdminCreateRawPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    username: str
    password: str


class AdminCreateHashedPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    username: str
    hashed_password: str


class AdminUpdateRawPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    username: str
    password: str


class AdminUpdateHashedPassword(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    username: str
    hashed_password: str


class PatientTestRead(BaseModel):
    id: int
    patient_id: int
    date: datetime
    name: str
    time: float
    correct: int
    wrong: int


class PatientTestCreate(BaseModel):
    name: str
    time: float
    correct: int
    wrong: int


class PatientTableProperties(BaseModel):
    demografic_data: str
    doctor_data: str
    medical_data: str
    lab_data: str
    disease_data: str
    history_data: str
    factors_data: str
    devotion_data: str
    life_quality_data: str
    stroop_data: str
    dst_data: str
    connection_data: str


class SavePatient(BaseModel):
    patients: List[PatientRead]
    stroop: List[PatientTestRead]
    dst: List[PatientTestRead]
    connection: List[PatientTestRead]
