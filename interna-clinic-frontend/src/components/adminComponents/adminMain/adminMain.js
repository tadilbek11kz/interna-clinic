import './adminMain.scss';
import AuthContext from '../../../auth/authContext';
import DeleteButtonIcon from './icons/deleteIcon.png';
import EditButtonIcon from './icons/editIcon.png';
import SearchButtonIcon from './icons/searchIcon.png'

import { Link, Navigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import AdminSavePatientMenu from '../adminSavePatientMenu/adminSavePatientMenu';
import AdminAddPatientMenu from '../adminAddPatientMenu/adminAddPatientMenu';
import AdminPatientDataEditor from '../adminPatientDataEditor/adminPatientDataEditor';
import AdminAddDoctorMenu from '../adminAddDoctorMenu/adminAddDoctorMenu';
import AdminDoctorDataEditor from '../adminDoctorDataEditor/adminDoctorDataEditor';
import AddAdminMenu from '../addAdminMenu/addAdminMenu';
import AdminDataEditor from '../adminDataEditor/adminDataEditor';
import Pagination from '../../pagination/pagination';
import PageContext from '../../../contexts/pageContext';

const AdminMain = ({ adminUsername, openedSection }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [patientsData, setPatientsData] = useState([]);
    const [doctorsData, setDoctorsData] = useState([]);
    const [adminsData, setAdminsData] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [isPatientDataEditorMenuOpened, setIsPatientDataEditorMenuOpened] = useState(false);
    const [isAddPatientMenuOpened, setIsAddPatientMenuOpened] = useState(false);
    const [isDoctorDataEditorMenuOpened, setIsDoctorDataEditorMenuOpened] = useState(false);
    const [isAddDoctorMenuOpened, setIsAddDoctorMenuOpened] = useState(false);
    const [isAddAdminMenuOpened, setIsAddAdminMenuOpened] = useState(false);
    const [isAdminDataEditorMenuOpened, setIsAddAdminDataEditorMenuOpened] = useState(false);
    const [searchPatientsResults, setSearchPatientsResults] = useState(null);
    const [searchDoctorsResults, setSearchDoctorsResults] = useState(null);
    const [searchAdminsResults, setSearchAdminsResults] = useState(null);
    const [isSavePatientMenuOpened, setIsSavePatientMenuOpened] = useState(false);

    const { currentPage, handlePageChange, prevCurrentPage, setPrevCurrentPage } = useContext(PageContext);
    const [totalPages, setTotalPages] = useState(0);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [prevTotalPages, setPrevTotalPages] = useState(0);

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

        const fetchPatientsData = async () => {
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
                let response = await fetch(`http://hepatest.kz/api/v1/patients?page=${currentPage}`, {
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
                        response = await fetch(`http://hepatest.kz/api/v1/patients?page=${currentPage}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const patientsData = await response.json();
                        setPatientsData(patientsData['data']);
                        setTotalPages(patientsData['total_pages']);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const patientsData = await response.json();
                    setPatientsData(patientsData['data']);
                    setTotalPages(patientsData['total_pages']);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the patients data.")
            }
        };

        const fetchDoctorsData = async () => {
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
                let response = await fetch(`http://hepatest.kz/api/v1/doctors?page=${currentPage}`, {
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
                        response = await fetch(`http://hepatest.kz/api/v1/doctors?page=${currentPage}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const doctorsData = await response.json();
                        setDoctorsData(doctorsData['data']);
                        setTotalPages(doctorsData['total_pages']);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const doctorsData = await response.json();
                    setDoctorsData(doctorsData['data']);
                    setTotalPages(doctorsData['total_pages']);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctors data.")
            }
        };

        const fetchAdminsData = async () => {
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
                let response = await fetch(`http://hepatest.kz/api/v1/admins`, {
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
                        response = await fetch(`http://hepatest.kz/api/v1/admins`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const adminsData = await response.json();
                        setAdminsData(adminsData);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const adminsData = await response.json();
                    setAdminsData(adminsData);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctors data.")
            }
        };

        if (openedSection === 'all_patients' && !isSearchClicked & searchPatientsResults === null) {
            fetchPatientsData();
        } else if (openedSection === 'all_doctors' && !isSearchClicked && searchDoctorsResults === null) {
            fetchDoctorsData();
        } else if (openedSection === 'all_admins') {
            fetchAdminsData();
        } else {
            if (searchPatientsResults !== null) {
                searchPatientButtonHandle();
            }
            if (searchDoctorsResults !== null) {
                searchDoctorButtonHandle();
            }
        }
    }, [openedSection, refresh, setIsAuthenticated, setRedirectTo, currentPage]);

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

    const openPatientDataEditorHandle = (patientId) => {
        setSelectedPatientId(patientId);
        setIsPatientDataEditorMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const openDoctorDataEditorHandle = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setIsDoctorDataEditorMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const openAdminDataEditorHandle = (adminId) => {
        setSelectedAdminId(adminId);
        setIsAddAdminDataEditorMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const closePatientDataEditorHandle = () => {
        setSelectedPatientId(null);
        setIsPatientDataEditorMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const closeDoctorDataEditorHandle = () => {
        setSelectedDoctorId(null);
        setIsDoctorDataEditorMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const closeAdminDataEditorHandle = () => {
        setSelectedAdminId(null);
        setIsAddAdminDataEditorMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

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
                    setPatientsData(patientsData.filter(patient => patient.id !== patientId));
                } catch (error) {
                    handleLogout();
                }
            } else {
                const responseData = await response.json();
                console.log(responseData);
                setPatientsData(patientsData.filter(patient => patient.id !== patientId));
            }
        } catch (error) {
            console.log("An error occurred while trying to delete the patient.")
        }

        if (patientsData.length - 1 === 0) {
            handlePageChange(prevCurrentPage);
        }
    };

    const deleteDoctorButtonHandle = async (doctorId) => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const confirmation = window.confirm("Вы уверены, что хотите удалить врача?");
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
            let response = await fetch(`http://hepatest.kz/api/v1/doctors/delete/${doctorId}`, {
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
                    response = await fetch(`http://hepatest.kz/api/v1/doctors/delete/${doctorId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const responseData = await response.json();
                    console.log(responseData);
                    setDoctorsData(doctorsData.filter(doctor => doctor.id !== doctorId));
                } catch (error) {
                    handleLogout();
                }
            } else {
                const responseData = await response.json();
                console.log(responseData);
                switch (response.status) {
                    case 409:
                        window.alert('Врач не может быть удалён, так как сущесвуют пациенты, привязанные к нему.');
                        break;
                    default:
                        setDoctorsData(doctorsData.filter(doctor => doctor.id !== doctorId));
                        break;
                }
            }
        } catch (error) {
            console.log("An error occurred while trying to delete the doctor.")
        }

        if (doctorsData.length - 1 === 0) {
            handlePageChange(prevCurrentPage);
        }
    };

    const deleteAdminButtonHandle = async (adminId) => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const confirmation = window.confirm("Вы уверены, что хотите удалить админа?");
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
            let response = await fetch(`http://hepatest.kz/api/v1/admins/delete/${adminId}`, {
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
                    response = await fetch(`http://hepatest.kz/api/v1/admins/delete/${adminId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const responseData = await response.json();
                    console.log(responseData);
                    setAdminsData(adminsData.filter(admin => admin.id !== adminId));
                } catch (error) {
                    handleLogout();
                }
            } else {
                const responseData = await response.json();
                console.log(responseData);
                setAdminsData(adminsData.filter(admin => admin.id !== adminId));
            }
        } catch (error) {
            console.log("An error occurred while trying to delete the admin.")
        }
    };

    const searchPatientButtonHandle = async () => {
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
            console.log("An error occurred while trying to search for the patients.")
        }

        setTimeout(() => {
            setIsSearchClicked(false);
        }, 1000);
    };

    useEffect(() => {
        console.log("TOTAL PAGES CHANGED: " + totalPages);
    }, [totalPages])

    const searchDoctorButtonHandle = async () => {
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
            let response = await fetch(`http://hepatest.kz/api/v1/doctors/search/${searchQuery}?page=${currentPage}`, {
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
                    response = await fetch(`http://hepatest.kz/api/v1/doctors/search/${searchQuery}?page=${currentPage}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const searchResults = await response.json();
                    if ('data' in searchResults) {
                        setSearchDoctorsResults(searchResults['data']);
                        setTotalPages(searchResults['total_pages']);
                    } else {
                        setSearchDoctorsResults(searchResults);
                        setTotalPages(1)
                    }
                    setDataLoading(false);
                } catch (error) {
                    handleLogout();
                }
            } else {
                const searchResults = await response.json();
                if ('data' in searchResults) {
                    setSearchDoctorsResults(searchResults['data']);
                    setTotalPages(searchResults['total_pages']);
                } else {
                    setSearchDoctorsResults(searchResults);
                    setTotalPages(1)
                }
                setDataLoading(false);
            }
        } catch (error) {
            console.log("TEST: " + searchDoctorsResults)
            console.log("An error occurred while trying to search for the patient.")
        }

        setTimeout(() => {
            setIsSearchClicked(false);
        }, 1000);
    };

    useEffect(() => {
        console.log("searchDoctorsResults: " + JSON.stringify(searchDoctorsResults))
    }, [searchDoctorsResults])

    const openSavePatientMenuHandle = () => {
        setIsSavePatientMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const openAddPatientMenuHandle = () => {
        setIsAddPatientMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const openAddDoctorMenuHandle = () => {
        setIsAddDoctorMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const openAddAdminMenuHandle = () => {
        setIsAddAdminMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const closeSavePatientMenuHandle = () => {
        setIsSavePatientMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const closeAddPatientMenuHandle = () => {
        setIsAddPatientMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const closeAddDoctorMenuHandle = () => {
        setIsAddDoctorMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const closeAddAdminMenuHandle = () => {
        setIsAddAdminMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    if (dataLoading) {
        return (
            <div className='loader'></div>
        );
    }

    if (openedSection === 'all_patients') {
        return (
            <div className='adminMain'>
                <h1 className='dataSectionTitle'>Пациенты в базе данных</h1>
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
                                console.log("PREV TOTAL PAGES BY DELETING QUERY: " + prevTotalPages)
                                setTotalPages(prevTotalPages);
                            }
                        }}
                    />
                    <img
                        src={SearchButtonIcon}
                        className='searchButton'
                        alt=''
                        onClick={() => {
                            searchPatientButtonHandle();
                            setPrevCurrentPage(currentPage);
                            handlePageChange(1);
                        }}
                    />
                </div>

                <div className='buttonGroup'>
                    <button className='addPatientButton' onClick={openAddPatientMenuHandle}>ДОБАВИТЬ ПАЦИЕНТА</button>
                    <button className='savePatientsButton' onClick={openSavePatientMenuHandle}>СКАЧАТЬ ТАБЛИЦУ</button>
                </div>


                <div className='patientsTable'>
                    {isAddPatientMenuOpened && <div className='blurBackground'></div>}
                    {isAddPatientMenuOpened && <AdminAddPatientMenu
                        closeAddPatientMenuHandle={closeAddPatientMenuHandle}
                        patientsData={patientsData}
                        setPatientsData={setPatientsData}
                    />}
                    {isSavePatientMenuOpened && <div className='blurBackground'></div>}
                    {isSavePatientMenuOpened && <AdminSavePatientMenu
                        closeSavePatientMenuHandle={closeSavePatientMenuHandle}
                        patientsData={patientsData}
                        setPatientsData={setPatientsData}
                    />}
                    {isPatientDataEditorMenuOpened && <div className='blurBackground'></div>}
                    {isPatientDataEditorMenuOpened && <AdminPatientDataEditor
                        closePatientDataEditorHandle={closePatientDataEditorHandle}
                        patientId={selectedPatientId}
                        patientsData={patientsData}
                        setPatientsData={setPatientsData}
                        searchPatientsResults={searchPatientsResults}
                        setSearchPatientsResults={setSearchPatientsResults}
                    />}
                    {searchPatientsResults === null && patientsData.map(patient => (
                        <React.Fragment key={patient.id}>
                            <div className='patientWrapper'>
                                <Link to={`/patient/${patient.IIN}/account`}>
                                    <div className='patientDataBox'>
                                        <h3 className='patientFullName'>{`${patient.first_name} ${patient.middle_name} ${patient.last_name}`}</h3>
                                        <p className='patientAge'>({patient.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='patientControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deletePatientButton' alt='Удалить пациента' onClick={() => deletePatientButtonHandle(patient.id)}></img>
                                    <img src={EditButtonIcon} className='editPatientButton' alt='Изменить данные' onClick={() => openPatientDataEditorHandle(patient.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    {searchPatientsResults && searchPatientsResults.detail === 'Patients not found' && <p className='notFoundTextError'>Ничего не найдено</p>}
                    {searchPatientsResults && searchPatientsResults.length > 0 && searchPatientsResults.detail !== 'Patients not found' && searchPatientsResults.map(patient => (
                        <React.Fragment key={patient.id}>
                            <div className='patientWrapper'>
                                <Link to={`/patient/${patient.IIN}/account`}>
                                    <div className='patientDataBox'>
                                        <h3 className='patientFullName'>{`${patient.first_name} ${patient.middle_name} ${patient.last_name}`}</h3>
                                        <p className='patientAge'>({patient.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='patientControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deletePatientButton' alt='Удалить пациента' onClick={() => deletePatientButtonHandle(patient.id)}></img>
                                    <img src={EditButtonIcon} className='editPatientButton' alt='Изменить данные' onClick={() => openPatientDataEditorHandle(patient.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                {patientsData.length > 0 && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />}

                <h1 className='accoutActionsSectionTitle'>Действия с аккаунтом</h1>
                <hr className='accoutActionsDividerLineStart' />
                <button className='logOutButton' onClick={() => logOutButtonHandle()}>Выйти из аккаунта</button>
            </div>
        );
    } else if (openedSection === 'all_admins') {
        return (
            <div className='adminMain'>
                <h1 className='dataSectionTitle'>Админы в базе данных</h1>
                <hr className='dataSectionDividerLineStart' />

                <button className='addAdminButton' onClick={openAddAdminMenuHandle}>ДОБАВИТЬ АДМИНИСТРАТОРА</button>

                <div className='adminsTable'>
                    {isAddAdminMenuOpened && <div className='blurBackground'></div>}
                    {isAddAdminMenuOpened && <AddAdminMenu
                        closeAddAdminMenuHandle={closeAddAdminMenuHandle}
                        adminsData={adminsData}
                        setAdminsData={setAdminsData}
                    />}
                    {isAdminDataEditorMenuOpened && <div className='blurBackground'></div>}
                    {isAdminDataEditorMenuOpened && <AdminDataEditor
                        closeAdminDataEditorHandle={closeAdminDataEditorHandle}
                        adminId={selectedAdminId}
                        adminsData={adminsData}
                        setAdminsData={setAdminsData}
                        searchAdminsResults={searchAdminsResults}
                        setSearchAdminsResults={setSearchAdminsResults}
                    />}
                    {searchAdminsResults === null && adminsData.map(admin => (
                        <React.Fragment key={admin.id}>
                            <div className='adminWrapper'>
                                <div className='adminDataBox'>
                                    <h3 className='adminFullName'>{`${admin.first_name} ${admin.middle_name} ${admin.last_name}`}</h3>
                                    <p className='adminUsername'>({admin.username})</p>
                                </div>
                                <div className='adminControlMenuWrapper'>
                                    {admin.username !== adminUsername && <img src={DeleteButtonIcon} className='deleteAdminButton' alt='Удалить администратора' onClick={() => deleteAdminButtonHandle(admin.id)}></img>}

                                    <img src={EditButtonIcon} className='editAdminButton' alt='Изменить данные' onClick={() => openAdminDataEditorHandle(admin.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    {searchAdminsResults && searchAdminsResults.detail === "Admins not found" && <p className='notFoundTextError'>Ничего не найдено</p>}
                    {searchAdminsResults && searchAdminsResults.length > 0 && searchAdminsResults.detail !== "Admins not found" && searchAdminsResults.map(admin => (
                        <React.Fragment key={admin.id}>
                            <div className='adminWrapper'>
                                <div className='adminDataBox'>
                                    <h3 className='adminFullName'>{`${admin.first_name} ${admin.middle_name} ${admin.last_name}`}</h3>
                                    <p className='adminUsername'>({admin.username})</p>
                                </div>
                                <div className='adminControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deleteDoctorButton' alt='Удалить администратора' onClick={() => deleteDoctorButtonHandle(admin.id)}></img>
                                    <img src={EditButtonIcon} className='editDoctorButton' alt='Изменить данные' onClick={() => openAddAdminMenuHandle(admin.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                <h1 className='accoutActionsSectionTitle'>Действия с аккаунтом</h1>
                <hr className='accoutActionsDividerLineStart' />
                <button className='logOutButton' onClick={() => logOutButtonHandle()}>Выйти из аккаунта</button>
            </div>
        );
    } else if (openedSection === 'all_doctors') {
        return (
            <div className='adminMain'>
                <h1 className='dataSectionTitle'>Врачи в базе данных</h1>
                <hr className='dataSectionDividerLineStart' />

                <div className='searchBarWrapper'>
                    <input
                        className='searchBar'
                        placeholder='Найти врача по ФИО или ИИН'
                        type='search'
                        onChange={(event) => {
                            if (event.target.value === '') {
                                setPrevCurrentPage(currentPage);
                                handlePageChange(1);
                                setSearchDoctorsResults(null);
                                console.log("PREV TOTAL PAGES BY DELETING QUERY: " + prevTotalPages)
                                setTotalPages(prevTotalPages);
                            }
                        }}
                    />
                    <img
                        src={SearchButtonIcon}
                        className='searchButton'
                        alt=''
                        onClick={() => {
                            searchDoctorButtonHandle();
                            setPrevCurrentPage(currentPage);
                            handlePageChange(1);
                        }}
                    />
                </div>

                <button className='addDoctorButton' onClick={openAddDoctorMenuHandle}>ДОБАВИТЬ ВРАЧА</button>

                <div className='doctorsTable'>
                    {isAddDoctorMenuOpened && <div className='blurBackground'></div>}
                    {isAddDoctorMenuOpened && <AdminAddDoctorMenu
                        closeAddDoctorMenuHandle={closeAddDoctorMenuHandle}
                        doctorsData={doctorsData}
                        setDoctorsData={setDoctorsData}
                    />}
                    {isDoctorDataEditorMenuOpened && <div className='blurBackground'></div>}
                    {isDoctorDataEditorMenuOpened && <AdminDoctorDataEditor
                        closeDoctorDataEditorHandle={closeDoctorDataEditorHandle}
                        doctorId={selectedDoctorId}
                        doctorsData={doctorsData}
                        setDoctorsData={setDoctorsData}
                        searchDoctorsResults={searchDoctorsResults}
                        setSearchDoctorsResults={setSearchDoctorsResults}
                    />}
                    {searchDoctorsResults === null && doctorsData.map(doctor => (
                        <React.Fragment key={doctor.id}>
                            <div className='doctorWrapper'>
                                <Link to={`/doctor/${doctor.IIN}/account`}>
                                    <div className='doctorDataBox'>
                                        <h3 className='doctorFullName'>{`${doctor.first_name} ${doctor.middle_name} ${doctor.last_name}`}</h3>
                                        <p className='doctorAge'>({doctor.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='doctorControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deleteDoctorButton' alt='Удалить врача' onClick={() => deleteDoctorButtonHandle(doctor.id)}></img>
                                    <img src={EditButtonIcon} className='editDoctorButton' alt='Изменить данные' onClick={() => openDoctorDataEditorHandle(doctor.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    {searchDoctorsResults && searchDoctorsResults.detail === "Doctors not found" && <p className='notFoundTextError'>Ничего не найдено</p>}
                    {searchDoctorsResults && searchDoctorsResults.length > 0 && searchDoctorsResults.detail !== "Doctors not found" && searchDoctorsResults.map(doctor => (
                        <React.Fragment key={doctor.id}>
                            <div className='doctorWrapper'>
                                <Link to={`/doctor/${doctor.IIN}/account`}>
                                    <div className='doctorDataBox'>
                                        <h3 className='doctorFullName'>{`${doctor.first_name} ${doctor.middle_name} ${doctor.last_name}`}</h3>
                                        <p className='doctorAge'>({doctor.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='doctorControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deleteDoctorButton' alt='Удалить врача' onClick={() => deleteDoctorButtonHandle(doctor.id)}></img>
                                    <img src={EditButtonIcon} className='editDoctorButton' alt='Изменить данные' onClick={() => openDoctorDataEditorHandle(doctor.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                {doctorsData.length > 0 && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />}

                <h1 className='accoutActionsSectionTitle'>Действия с аккаунтом</h1>
                <hr className='accoutActionsDividerLineStart' />
                <button className='logOutButton' onClick={() => logOutButtonHandle()}>Выйти из аккаунта</button>
            </div>
        );
    }
}

export default AdminMain;
