from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth.auth_router import oauth2_scheme
from app.api.v1.services.pagination.pagination_service import Pagination
from app.api.v1.services.patient_service import PatientService
from app.dependencies import get_patient_service, get_async_session
from app.schemas.schemas import PatientRead, PatientCreateRawPassword, PatientUpdateRawPassword, PatientPaginationResult, PatientTestRead, PatientTestCreate, PatientTableProperties, SavePatient
from app.api.v1.repositories.patient_repository import PatientRepository

router = APIRouter(
    tags=["Patient"],
    prefix="/api/v1"
)


@router.get("/patients", response_model=PatientPaginationResult)
async def get_patients(token: str = Depends(oauth2_scheme),
                       patient_service: PatientService = Depends(get_patient_service),
                       page: int = 1, page_size: int = 10):
    """
    This method is used to retrieve all patients from the DB with given page and page size.

    Returns:
        patients (PatientPaginationResult)
    """
    pagination = Pagination(page, page_size)
    total, patients = await patient_service.get_patients(token, pagination.offset, page_size)

    return pagination.paginate(total, patients)


@router.get("/patients/{patient_id}", response_model=PatientRead)
async def get_patient_by_id(patient_id: int, token: str = Depends(oauth2_scheme),
                            patient_service: PatientService = Depends(get_patient_service)):
    """
    This method is used to retrieve a certain patient from the DB.

    Returns:
        patient (PatientRead)
    """

    patient = await patient_service.get_patient_by_id(patient_id, token)

    return patient


@router.get("/patients/IIN/{patient_IIN}", response_model=PatientRead)
async def get_patient_by_IIN(patient_IIN: str, token: str = Depends(oauth2_scheme),
                             patient_service: PatientService = Depends(get_patient_service)):
    """
    This method is used to retrieve a certain patient from the DB by his IIN.

    Returns:
        patient (PatientRead)
    """

    patient = await patient_service.get_patient_by_IIN(patient_IIN, token)

    return patient


@router.get("/patients/search/{search_query}", response_model=PatientPaginationResult)
async def search_patients(search_query: str, token: str = Depends(oauth2_scheme),
                          page: int = 1, page_size: int = 10,
                          session: AsyncSession = Depends(get_async_session)):
    """
    This method is used to search and retrieve patients from the DB
    by a search query (any combination of: (first_name, last_name, middle_name) or IIN).

    Returns:
        patients (PatientPaginationResult)
    """
    patient_repository = PatientRepository(session)
    pagination = Pagination(page, page_size)
    total, patients = await patient_repository.search_patients(search_query, token, pagination.offset, page_size)

    return pagination.paginate(total, patients)


@router.post("/patients/register", response_model=PatientRead)
async def create_patient(new_patient_data: PatientCreateRawPassword, token: str = Depends(oauth2_scheme),
                         patient_service: PatientService = Depends(get_patient_service)):
    """
    This method is used to create a patient with the given data ('PatientCreate' model).

    Returns:
        created patient (dict[str, Any])
    """

    new_patient = await patient_service.create_patient(token, new_patient_data)

    return new_patient


@router.post("/patients/download")
async def download_patients(patient_data_properties: PatientTableProperties, token: str = Depends(oauth2_scheme),
                            patient_service: PatientService = Depends(get_patient_service)):
    """
    This method is used to download all patients from the DB in EXCEL format.

    Returns:
        EXCEL file with all patients (FileResponse)
    """

    data = await patient_service.download_patients(token, patient_data_properties)
    print(data)
    # print(data[0])
    # df = pd.DataFrame.from_records(data, columns=['first_name'])
    # print(df)
    # buffer = BytesIO()

    # with pd.ExcelWriter(buffer) as writer:
    #     df.to_excel(writer, index=False)

    # return StreamingResponse(
    #     BytesIO(buffer.getvalue()),
    #     media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    #     headers={"Content-Disposition": f"attachment; filename=data.xlsx"}
    # )
    return data


@router.put("/patients/{patient_id}", response_model=PatientRead)
async def update_patient(patient_id: int, new_data_for_patient: PatientUpdateRawPassword,
                         token: str = Depends(oauth2_scheme),
                         patient_service: PatientService = Depends(get_patient_service)):
    """
    This method is used to update the existing patient data with the new one ('PatientUpdateRawPassword' model).

    Returns:
        updated patient (dict[str, Any])
    """

    patient_to_update = await patient_service.update_patient(patient_id, token, new_data_for_patient)

    return patient_to_update


@router.delete("/patients/delete/{patient_id}", response_model=None)
async def delete_patient(patient_id: int, token: str = Depends(oauth2_scheme),
                         patient_service: PatientService = Depends(get_patient_service)) -> dict:
    """
    This method is used to delete the existing patient with given id.

    Returns:
        A dictionary containing the deleted patient ID and a message (dict)
    """

    result = await patient_service.delete_patient(patient_id, token)

    return result


@router.post("/patients/{patient_IIN}/test/create", response_model=PatientTestRead)
async def create_patient_test(patient_IIN: str, test_data: PatientTestCreate, token: str = Depends(oauth2_scheme),
                              patient_service: PatientService = Depends(get_patient_service)):
    """
    This method is used to create a patient test with the given data ('PatientTestCreate' model).

    Returns:
        created patient test (dict[str, Any])
    """
    patient = await patient_service.get_patient_by_IIN(patient_IIN, token)
    patient_id = patient.id

    new_patient_test = await patient_service.create_patient_test(test_data, patient_id, token)

    return new_patient_test


@router.get("/patients/{patient_IIN}/tests", response_model=List[PatientTestRead])
async def get_patient_tests(patient_IIN: str, token: str = Depends(oauth2_scheme),
                            patient_service: PatientService = Depends(get_patient_service)):
    """
    This method is used to retrieve all patient tests from the DB.

    Returns:
        patient tests (PatientTestRead)
    """
    patient = await patient_service.get_patient_by_IIN(patient_IIN, token)
    patient_id = patient.id
    total, patient_tests = await patient_service.get_patient_tests(patient_id, token)

    return patient_tests


@router.get("/patients/{patient_IIN}/tests/names", response_model=List[str])
async def get_patient_test_names(patient_IIN: str, token: str = Depends(oauth2_scheme),
                                 patient_service: PatientService = Depends(get_patient_service)):
    """
    This method is used to retrieve all patient test names from the DB.

    Returns:
        patient test names (List[str])
    """

    patient = await patient_service.get_patient_by_IIN(patient_IIN, token)
    patient_id = patient.id

    patient_test_names = await patient_service.get_patient_test_names(patient_id, token)

    return patient_test_names


@router.get("/patients/{patient_IIN}/test/{test_name}", response_model=List[PatientTestRead])
async def get_patient_test_by_name(patient_IIN: str, test_name: str, token: str = Depends(oauth2_scheme),
                                   patient_service: PatientService = Depends(get_patient_service)):
    """
    This method is used to retrieve a certain patient test from the DB.

    Returns:
        patient test (PatientTestRead)
    """
    patient = await patient_service.get_patient_by_IIN(patient_IIN, token)
    patient_id = patient.id

    patient_test = await patient_service.get_patient_test_by_name(patient_id, test_name, token)

    return patient_test
