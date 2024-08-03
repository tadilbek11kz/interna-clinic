from datetime import datetime, UTC
from typing import Sequence, Any

from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import select, Row, RowMapping, or_, func, text, distinct
from sqlalchemy.orm import load_only, joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth.auth import verify_token
from app.models.models import Patient, PatientTest, Doctor
from app.schemas.schemas import PatientRead, PatientCreateHashedPassword, PatientUpdateHashedPassword, PatientTestCreate, PatientTestRead, PatientTableProperties


class PatientRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_patients(self, offset: int = 0, limit: int = 10) -> tuple[Any | None, Sequence[Patient]]:
        """
        This method is used to retrieve all patients from the DB.

        Returns:
            total (int)
            patients (tuple[Any | None, Sequence[Patient]])
        """

        total = await self.session.execute(func.count(Patient.id))
        total = total.scalar()
        data = await self.session.execute(select(Patient).offset(offset).limit(limit))
        patients = data.scalars().all()

        return total, patients

    async def get_patient_by_id(self, patient_id: int) -> PatientRead | None:
        """
        This method is used to retrieve a certain patient from the DB by his 'id' field.

        Returns:
            patients (Patient | None)
        """

        data = await self.session.execute(select(Patient).where(Patient.id == patient_id))
        patient = data.scalars().first()

        return patient

    async def get_patient_by_IIN(self, patient_IIN: str) -> PatientRead | None:
        """
        This method is used to retrieve a certain patient from the DB by 'IIN' field.

        Returns:
            patient (PatientRead | None)
        """

        data = await self.session.execute(select(Patient).where(Patient.IIN == patient_IIN))
        patient = data.scalars().first()

        return patient

    async def search_patients(self, search_query: str, token: str, offset: int = 0, limit: int = 10) -> tuple[
            int, Sequence[Row[Any] | RowMapping | Any]]:
        """
        This method is used to search and retrieve patients from the DB
        by a search query (any combination of: (first_name, last_name, middle_name) or IIN).

        Returns:
            total (int)
            patients (Sequence[Row[Any] | RowMapping | Any])
        """

        try:
            user_role = verify_token(token)
            if user_role["user_role"] in ["Patient"]:
                raise HTTPException(status_code=403, detail="Forbidden: Unauthorized role")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

        words = search_query.lower().split()
        conditions = [func.lower(Patient.IIN).like(f"%{word}%") for word in words]
        conditions.extend([func.lower(Patient.first_name).like(f"%{word}%") for word in words])
        conditions.extend([func.lower(Patient.last_name).like(f"%{word}%") for word in words])
        conditions.extend([func.lower(Patient.middle_name).like(f"%{word}%") for word in words])

        query = select(Patient, func.similarity(func.concat_ws(' ', Patient.first_name,
                                                               Patient.last_name, Patient.middle_name),
                                                text(':search_query')).label('similarity')). \
            where(or_(*conditions)). \
            order_by(text('similarity DESC')). \
            offset(offset).limit(limit)

        result = await self.session.execute(query, {'search_query': ' '.join(words)})
        patients = result.scalars().all()

        total = await self.session.execute(select(func.count()).where(or_(*conditions)))
        total = total.scalar()

        if not patients:
            raise HTTPException(status_code=404, detail="Patients not found")

        return total, patients

    async def create_patient(self, new_patient_data: PatientCreateHashedPassword) -> dict[str, Any]:
        """
        This method is used to create a patient with the given data ('PatientCreateHashedPassword' model).

        Returns:
            created patient (dict[str, Any])
        """

        new_patient = Patient(**new_patient_data.model_dump())
        self.session.add(new_patient)
        await self.session.flush()
        await self.session.commit()

        return new_patient

    async def download_patients(self, patient_data_properties: PatientTableProperties) -> dict[str, Any]:
        """
        This method is used to download all patients from the DB.

        Returns:
            file response (dict[str, Any])
        """

        values = []
        test_names = []

        for key, value in patient_data_properties.model_dump().items():
            if key == "demografic_data" and value == 'Да':
                values += ["first_name", "last_name", "middle_name", "IIN", "gender", "age", "ethnicity", "region", "height", "weight", "education", "marital_status", "job_description", "driving_status", "was_involved_in_car_accidents"]

            if key == "medical_data" and value == 'Да':
                values += ["cirrhosis", "duration_of_illness"]

            if key == "lab_data" and value == 'Да':
                values += ["platelet_count", "hemoglobin_level", "ALT", "ALT_unit", "AAT", "AAT_unit", "bilirubin", "creatinine", "INA", "albumin", "sodium_blood_level", "potassium_ion", "blood_ammonia"]

            if key == "disease_data" and value == 'Да':
                values += ["indirect_elastography_of_liver", "indirect_elastography_of_spleen", "EVV", "red_flags_EVV", "presence_of_ascites",
                           "connection_test_a", "connection_test_b", "symbol_test", "serial_test", "line_test", "line_test_number_of_border_touches", "line_test_number_of_beyond_border", "connection_test_a_wrong", "connection_test_b_wrong", "symbol_test_wrong", "serial_test_wrong", "line_test_wrong", "type_of_encephalopathy", "degree_of_encephalopathy", "process_of_encephalopathy", "presence_of_precipitating_factors"]

            if key == "history_data" and value == 'Да':
                values += ["comorbidities", "was_planned_hospitalized_with_liver_diseases", "number_of_planned_hospitalizations_with_liver_diseases", "was_planned_hospitalized_without_liver_diseases", "number_of_planned_hospitalizations_without_liver_diseases", "was_emergency_hospitalized_with_liver_diseases",
                           "number_of_emergency_hospitalizations_with_liver_diseases", "was_emergency_hospitalized_without_liver_diseases", "number_of_emergency_hospitalizations_without_liver_diseases", "was_injured", "hepatocellular_carcinoma", "previous_infectious_diseases", "dehydration", "portosystemic_bypass_surgery", "CP", "accepted_PE_medications"]

            if key == "factors_data" and value == 'Да':
                values += ["GIB", "previous_infectious_diseases", "stool_character", "dehydration", "portosystemic_bypass_surgery", "thrombosis", "medicines", "renal_impairment", "bad_habits"]

            if key == "devotion_data" and value == 'Да':
                values += ["CP", "accepted_PE_medications", "accepted_medications_at_the_time_of_inspection"]

            if key == "life_quality_data" and value == 'Да':
                values += ["health_condition", "last_year_health_condition", "physical_activity_a", "physical_activity_b", "physical_activity_c", "physical_activity_d", "physical_activity_e", "physical_activity_f", "physical_activity_g", "physical_activity_h", "physical_activity_j", "physical_activity_k", "physical_work_a", "physical_work_b",
                           "physical_work_c", "physical_work_d", "emotial_state_a", "emotial_state_b", "emotial_state_c", "family_time", "pain", "pain_effect", "mood_a", "mood_b", "mood_c", "mood_d", "mood_e", "mood_f", "mood_g", "mood_h", "mood_k", "communication", "health_condition_a", "health_condition_b", "health_condition_c", "health_condition_d"]

            if key == "stroop_data" and value == 'Да':
                test_names += ["Stroop Test"]

            if key == "dst_data" and value == 'Да':
                test_names += ["DST"]

            if key == "connection_data" and value == 'Да':
                test_names += ["Connect Dot Test"]

        values = [getattr(Patient, f) for f in values]
        data = await self.session.execute(select(Patient).options(load_only(*values), joinedload(Patient.doctor)))
        patients = data.scalars().all()

        data = await self.session.execute(select(PatientTest).options(joinedload(PatientTest.patient)).filter(PatientTest.name.in_(test_names)))
        tests = data.scalars().all()

        response = {
            "patients": patients,
            "tests": tests
        }

        return response

    async def update_patient(self, patient_id: int, new_data_for_patient: PatientUpdateHashedPassword) -> PatientRead:
        """
        This method is used to update the existing patient data with the new one ('PatientUpdateHashedPassword' model).

        Returns:
            updated patient (dict[str, Any])

        Raises:
            HTTPException: If the patient with the given ID is not found.
        """

        patient_to_update = await self.get_patient_by_id(patient_id)

        for key, value in new_data_for_patient.model_dump().items():
            setattr(patient_to_update, key, value)

        await self.session.flush()
        await self.session.commit()

        return patient_to_update

    async def delete_patient(self, patient_id: int) -> int:
        """
        This method is used to delete the existing patient with given ID.

        Returns:
            deleted patient ID (int)

        Raises:
            HTTPException: If the patient with the given ID is not found.
        """

        patient_to_delete = await self.get_patient_by_id(patient_id)

        await self.session.delete(patient_to_delete)
        await self.session.commit()

        return patient_id

    async def create_patient_test(self, new_patient_test_data: PatientTestCreate, patient_id: int) -> dict[str, Any]:
        """
        This method is used to create a patient test with the given data ('PatientTestCreate' model).

        Returns:
            created patient test dict[str, Any]
        """

        new_patient_test = PatientTest(**new_patient_test_data.model_dump())
        new_patient_test.patient_id = patient_id
        new_patient_test.date = datetime.today()
        self.session.add(new_patient_test)
        await self.session.flush()
        await self.session.commit()

        return new_patient_test

    async def get_patient_tests(self, patient_id: int) -> tuple[Any | None, Sequence[PatientTest]]:
        """
        This method is used to retrieve all patient tests from the DB.

        Returns:
            total (int)
            patient tests (tuple[Any | None, Sequence[PatientTest]])
        """

        total = await self.session.execute(func.count(PatientTest.id))
        total = total.scalar()
        data = await self.session.execute(select(PatientTest).where(PatientTest.patient_id == patient_id))
        patient_tests = data.scalars().all()

        return total, patient_tests

    async def get_patient_test_names(self, patient_id: int) -> Sequence[str]:
        """
        This method is used to retrieve all patient test names from the DB.

        Returns:
            patient test names (Sequence[str])
        """

        data = await self.session.execute(select(PatientTest.name).where(PatientTest.patient_id == patient_id).distinct())
        patient_test_names = data.scalars().all()

        return patient_test_names

    async def get_patient_test_by_name(self, patient_id: int, test_name: str) -> Sequence[PatientTest] | None:
        """
        This method is used to retrieve a certain patient test from the DB by his 'name' field.

        Returns:
            patient test (PatientTest | None)
        """

        data = await self.session.execute(select(PatientTest).where(PatientTest.patient_id == patient_id, PatientTest.name == test_name).order_by(PatientTest.date.asc()))
        patient_tests = data.scalars().all()

        return patient_tests
