import './doctorMain.scss';
import AuthContext from '../../../auth/authContext';
import DeleteButtonIcon from './icons/deleteIcon.png';
import EditButtonIcon from './icons/editIcon.png';
import SearchButtonIcon from './icons/searchIcon.png'

import { Link, Navigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import DoctorPatientDataEditor from '../doctorPatientDataEditor/doctorPatientDataEditor';
import DoctorAddPatientMenu from '../doctorAddPatientMenu/doctorAddPatientMenu';
import PageContext from '../../../contexts/pageContext';
import Pagination from '../../pagination/pagination';

const DoctorMain = ({ doctorIIN, openedSection }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [doctorData, setDoctorData] = useState({});
    const [doctorsPatientsData, setDoctorsPatientsData] = useState([])
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [isDataEditorMenuOpened, setIsMenuOpened] = useState(false);
    const [isAddPatientMenuOpened, setIsAddPatientMenuOpened] = useState(false);
    const [searchPatientsResults, setSearchPatientsResults] = useState(null);

    const { currentPage, handlePageChange, prevCurrentPage, setPrevCurrentPage } = useContext(PageContext);
    const [totalPages, setTotalPages] = useState(0);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [prevTotalPages, setPrevTotalPages] = useState(1);

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);


    useEffect(() => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const fetchDoctorData = async () => {
            const currentUserData = localStorage.getItem('currentUserData');
            let accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!currentUserData) {
                handleLogout();
                return;
            }

            if (!accessToken) {
                if (refreshToken) {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                } else {
                    handleLogout();
                    return;
                }
            }

            try {
                let response = await fetch(`http://hepatest.kz/api/v1/doctors/IIN/${doctorIIN}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    }
                });

                if (!response.ok && response.status === 401) {
                    try {
                        await refresh();
                        accessToken = localStorage.getItem('accessToken');
                        response = await fetch(`http://hepatest.kz/api/v1/doctors/IIN/${doctorIIN}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const doctorData = await response.json();
                        setDoctorData(doctorData);
                        setDataLoading(false);
                        return doctorData;
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const doctorData = await response.json();
                    setDoctorData(doctorData);
                    setDataLoading(false);
                    return doctorData;
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctor data.")
            }
        };

        const fetchDoctorsPatientsData = async (doctorIIN) => {
            const currentUserData = localStorage.getItem('currentUserData');
            let accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!currentUserData) {
                handleLogout();
                return;
            }

            if (!accessToken) {
                if (refreshToken) {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                } else {
                    handleLogout();
                    return;
                }
            }

            try {
                let response = await fetch(`http://hepatest.kz/api/v1/doctors/${doctorIIN}/patients?page=${currentPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    }
                });

                if (!response.ok && response.status === 401) {
                    try {
                        await refresh();
                        accessToken = localStorage.getItem('accessToken');
                        response = await fetch(`http://hepatest.kz/api/v1/doctors/${doctorIIN}/patients?page=${currentPage}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const doctorsPatientsData = await response.json();
                        setDoctorsPatientsData(doctorsPatientsData['data']);
                        setTotalPages(doctorsPatientsData['total_pages']);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const doctorsPatientsData = await response.json();
                    setDoctorsPatientsData(doctorsPatientsData['data']);
                    setTotalPages(doctorsPatientsData['total_pages']);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctor data.")
            }
        }

        (async () => {
            const doctorData = await fetchDoctorData();
            if (doctorData && openedSection === 'patients' && !isSearchClicked && searchPatientsResults === null) {
                fetchDoctorsPatientsData(doctorData.IIN);
            } else {
                if (searchPatientsResults !== null) {
                    searchPatientsButtonHandle();
                }
            }
        })();
    }, [openedSection, refresh, setIsAuthenticated, setRedirectTo, currentPage]);

    const deletePatientButtonHandle = async (patientId) => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const confirmation = window.confirm("Вы уверены, что хотите удалить пациента?");
        if (!confirmation) {
            return;
        }

        const currentUserData = localStorage.getItem('currentUserData');
        let accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!currentUserData) {
            handleLogout();
            return;
        }

        if (!accessToken) {
            if (refreshToken) {
                await refresh();
                accessToken = localStorage.getItem('accessToken');
            } else {
                handleLogout();
                return;
            }
        }

        try {
            let response = await fetch(`http://hepatest.kz/api/v1/patients/delete/${patientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            });

            if (!response.ok && response.status === 401) {
                try {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://hepatest.kz/api/v1/patients/delete/${patientId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const responseData = await response.json();
                    console.log(responseData);
                    setDoctorsPatientsData(doctorsPatientsData.filter(patient => patient.id !== patientId));
                } catch (error) {
                    handleLogout();
                }
            } else {
                const responseData = await response.json();
                console.log(responseData);
                setDoctorsPatientsData(doctorsPatientsData.filter(patient => patient.id !== patientId));
            }
        } catch (error) {
            console.log("An error occurred while trying to delete the patient.")
        }

        if (doctorsPatientsData.length - 1 === 0) {
            handlePageChange(prevCurrentPage);
        }
    };

    useEffect(() => {
        console.log("PREV TOTAL PAGES: " + prevTotalPages)
    }, [prevTotalPages])

    const searchPatientsButtonHandle = async () => {
        setPrevTotalPages(totalPages);
        setIsSearchClicked(true);

        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const currentUserData = localStorage.getItem('currentUserData');
        let accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!currentUserData) {
            handleLogout();
            return;
        }

        if (!accessToken) {
            if (refreshToken) {
                await refresh();
                accessToken = localStorage.getItem('accessToken');
            } else {
                handleLogout();
                return;
            }
        }

        const searchQuery = document.querySelector('.searchBar').value;
        if (searchQuery === '') {
            return;
        }

        try {
            let response = await fetch(`http://hepatest.kz/api/v1/patients/search/${searchQuery}?page=${currentPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            });

            if (!response.ok && response.status === 401) {
                try {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://hepatest.kz/api/v1/patients/search/${searchQuery}?page=${currentPage}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const searchResults = await response.json();
                    if ('data' in searchResults) {
                        setSearchPatientsResults(searchResults['data']);
                        setTotalPages(searchResults['total_pages']);
                    } else {
                        setSearchPatientsResults(searchResults);
                        setTotalPages(1)
                    }
                    setDataLoading(false);
                } catch (error) {
                    handleLogout();
                }
            } else {
                const searchResults = await response.json();
                if ('data' in searchResults) {
                    setSearchPatientsResults(searchResults['data']);
                    setTotalPages(searchResults['total_pages']);
                } else {
                    setSearchPatientsResults(searchResults);
                    setTotalPages(1)
                }
                setDataLoading(false);
            }
        } catch (error) {
            console.log("An error occurred while trying to search for the patient.")
        }

        setTimeout(() => {
            setIsSearchClicked(false);
        }, 1000);
    };

    const openPatientDataEditorHandle = (patientId) => {
        setSelectedPatientId(patientId);
        setIsMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const closePatientDataEditorHandle = () => {
        setSelectedPatientId(null);
        setIsMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const openAddPatientMenuHandle = () => {
        setIsAddPatientMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const closeAddPatientMenuHandle = () => {
        setIsAddPatientMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const logOutButtonHandle = () => {
        const confirmation = window.confirm("Вы уверены, что хотите выйти из аккаунта?");
        if (!confirmation) {
            return;
        }

        setIsAuthenticated(false);
        setRedirectTo('/login');
        localStorage.removeItem('currentUserData');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    if (dataLoading) {
        return (
            <div className='loader'></div>
        );
    }

    if (openedSection === 'account') {
        return (
            <div className='doctorMain'>
                <h1 className='dataSectionTitle'>Личные данные</h1>
                <hr className='dataSectionDividerLineStart' />
                <div className='personalDataWrapper'>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Имя</div>
                        <div className='doctorDataBox'>{doctorData.first_name}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Фамилия</div>
                        <div className='doctorDataBox'>{doctorData.last_name}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Отчество</div>
                        <div className='doctorDataBox'>{doctorData.middle_name}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>ИИН</div>
                        <div className='doctorDataBox'>{doctorData.IIN}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Пол</div>
                        <div className='doctorDataBox'>{doctorData.gender}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Возраст</div>
                        <div className='doctorDataBox'>{doctorData.age}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Квалификация</div>
                        <div className='doctorDataBox'>{doctorData.qualification}</div>
                    </div>
                </div>

                <h1 className='accoutActionsSectionTitle'>Действия с аккаунтом</h1>
                <hr className='accoutActionsDividerLineStart' />
                <button className='logOutButton' onClick={() => logOutButtonHandle()}>Выйти из аккаунта</button>
            </div>
        );
    } else if (openedSection === 'patients') {
        return (
            <div className='doctorMain'>
                <h1 className='dataSectionTitle'>Ваши пациенты</h1>
                <hr className='dataSectionDividerLineStart' />

                <div className='searchBarWrapper'>
                    <input
                        className='searchBar'
                        placeholder='Найти пациента по ФИО или ИИН'
                        type='search'
                        onChange={(event) => {
                            if (event.target.value === '') {
                                setPrevCurrentPage(currentPage);
                                handlePageChange(1);
                                setSearchPatientsResults(null);
                            }
                        }}
                    />
                    <img
                        src={SearchButtonIcon}
                        className='searchButton'
                        alt=''
                        onClick={() => {
                            searchPatientsButtonHandle();
                            setPrevCurrentPage(currentPage);
                            handlePageChange(1);
                        }}
                    />
                </div>

                <button className='addPatientButton' onClick={openAddPatientMenuHandle}>ДОБАВИТЬ ПАЦИЕНТА</button>

                {(doctorsPatientsData.length > 0 || searchPatientsResults !== null) && <div className='doctorPatientsTable'>
                    {isAddPatientMenuOpened && <div className='blurBackground'></div>}
                    {isAddPatientMenuOpened && <DoctorAddPatientMenu
                        closeAddPatientMenuHandle={closeAddPatientMenuHandle}
                        doctorId={doctorData.id}
                        doctorsPatientsData={doctorsPatientsData}
                        setDoctorsPatientsData={setDoctorsPatientsData}
                    />}
                    {isDataEditorMenuOpened && <div className='blurBackground'></div>}
                    {isDataEditorMenuOpened && <DoctorPatientDataEditor
                        closePatientDataEditorHandle={closePatientDataEditorHandle}
                        patientId={selectedPatientId}
                        doctorsPatientsData={doctorsPatientsData}
                        setDoctorsPatientsData={setDoctorsPatientsData}
                        searchPatientsResults={searchPatientsResults}
                        setSearchPatientsResults={setSearchPatientsResults}
                    />}
                    {searchPatientsResults === null && doctorsPatientsData.map(patient => (
                        <React.Fragment key={patient.id}>
                            <div className='doctorPatientWrapper'>
                                <Link to={`/patient/${patient.IIN}/account`}>
                                    <div className='doctorPatientDataBox'>
                                        <h3 className='patientFullName'>{`${patient.first_name} ${patient.middle_name} ${patient.last_name}`}</h3>
                                        <p className='patientAge'>({patient.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='doctorPatientControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deletePatientButton' alt='Удалить пациента' onClick={() => deletePatientButtonHandle(patient.id)}></img>
                                    <img src={EditButtonIcon} className='editPatientButton' alt='Изменить данные' onClick={() => openPatientDataEditorHandle(patient.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    {searchPatientsResults && searchPatientsResults.detail === 'Patients not found' && <p className='notFoundTextError'>Ничего не найдено</p>}
                    {searchPatientsResults && searchPatientsResults.length > 0 && searchPatientsResults.detail !== 'Patients not found' && searchPatientsResults.map(patient => (
                        <React.Fragment key={patient.id}>
                            <div className='doctorPatientWrapper'>
                                <Link to={`/patient/${patient.IIN}/account`}>
                                    <div className='doctorPatientDataBox'>
                                        <h3 className='patientFullName'>{`${patient.first_name} ${patient.middle_name} ${patient.last_name}`}</h3>
                                        <p className='patientAge'>({patient.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='doctorPatientControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deletePatientButton' alt='Удалить пациента' onClick={() => deletePatientButtonHandle(patient.id)}></img>
                                    <img src={EditButtonIcon} className='editPatientButton' alt='Изменить данные' onClick={() => openPatientDataEditorHandle(patient.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                }
                {doctorsPatientsData.length > 0 && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />}
            </div>
        );
    }
}

export default DoctorMain;
