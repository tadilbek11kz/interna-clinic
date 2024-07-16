import { useCallback, useContext, useEffect, useState } from 'react';
import './adminDoctorDataEditor.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';

const AdminDoctorDataEditor = ({ closeDoctorDataEditorHandle, doctorId, doctorsData, setDoctorsData, searchDoctorsResults, setSearchDoctorsResults }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [doctorData, setDoctorData] = useState({});
    const [updatedDoctorData, setUpdatedDoctorData] = useState(doctorData);
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fields = {
        // REQUIRED
        first_name: { type: 'input', translation: 'Имя', required: true, data_type: 'str' },
        last_name: { type: 'input', translation: 'Фамилия', required: true, data_type: 'str' },
        middle_name: { type: 'input', translation: 'Отчество', required: true, data_type: 'str' },
        IIN: { type: 'input', translation: 'ИИН', required: true, data_type: 'str' },
        password: { type: 'input', translation: 'Пароль', required: true, data_type: 'str' },
        age: { type: 'input', translation: 'Возраст', required: true, data_type: 'int' },
        gender: { type: 'enum', options: ['Мужской', 'Женский'], translation: 'Пол', required: true, data_type: 'str' },
        // qualification: {type: 'enum', options: ['Гастроэнтеролог'], translation: 'Выберите квалификацию', required: true, data_type: 'str'} - Автоматически присваивается в меню для создания врача                                                                  
    }

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
                let response = await fetch(`http://hepatest.kz/api/v1/doctors/${doctorId}`, {
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
                        response = await fetch(`http://hepatest.kz/api/v1/doctors/${doctorId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const doctorData = await response.json();
                        setDoctorData(doctorData);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const doctorData = await response.json();
                    setDoctorData(doctorData);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctor data.")
            }
        }

        fetchDoctorData();
    }, [doctorId, refresh, setIsAuthenticated, setRedirectTo])

    const handleInputChange = (fieldName, event) => {
        const field = fields[fieldName];
        let updatedValue = event.target.value;

        setDoctorData(prevDoctorData => {
            let updatedDoctorData = { ...prevDoctorData };

            if (updatedValue === '') {
                switch (field.data_type) {
                    case 'int':
                        updatedValue = 0;
                        break;
                    default:
                        updatedValue = '';
                }
            }

            if (fieldName === 'password') {
                setNewPassword(updatedValue)
                updatedDoctorData['password'] = updatedValue;
            } else {
                updatedDoctorData[fieldName] = updatedValue;
            }

            return updatedDoctorData;
        });
    };

    useEffect(() => {
        console.log("DOCTOR DATA: " + JSON.stringify(doctorData));
    }, [doctorData]);

    const areAllFieldsValid = (doctorToAddFinalData, fields) => {
        const traverseFields = (data, fieldPath) => {
            for (let key in data) {
                console.log("CHECKING... " + key + " | VALUE: " + data[key])
                if (Array.isArray(data[key])) {
                    const fieldTranslation = fields[key]?.translation || key;

                    if (data[key].length === 0) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' является обязательным и должно быть заполнено.`);
                    }
                } else if (typeof data[key] === 'object' && data[key] !== null) {
                    console.log("IT SEEMS LIKE IT'S OBJECT, OBVIOUSLY...")
                    traverseFields(data[key], fieldPath ? `${fieldPath}.${key}` : key);
                } else {
                    const fieldTranslation = fields[key]?.translation || key;

                    if (key === 'IIN') {
                        if (!/^\d{12}$/.test(data[key])) {
                            console.log("OOOPS ERROR HERE")
                            throw new Error(`Поле '${fieldTranslation}' должно содержать ровно 12 цифр.`);
                        }
                    }
                    if ((key === 'first_name' || key === 'last_name' || key === 'middle_name') && data[key] === '') {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' не может быть пустым.`);
                    }
                    if (fields[key]?.data_type === 'int' && !Number.isInteger(Number(data[key]))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' должно быть целым числом.`);
                    }
                }
            }
        };

        try {
            traverseFields(doctorToAddFinalData, '');
        } catch (error) {
            console.error(error.message);
            console.log("ERROR FIELD: " + error.message.split(' ')[1])
            return error.message;
        }
    };

    const saveDoctorData = async () => {
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

        if (!newPassword) {
            updatedDoctorData['password'] = '';
        }

        console.log("FINAL DOCTOR DATA: " + JSON.stringify({ ...doctorData, ...updatedDoctorData }));
        const errorFieldMessage = areAllFieldsValid({ ...doctorData, ...updatedDoctorData }, fields);
        if (errorFieldMessage) {
            setErrorMessage(errorFieldMessage);
            return;
        }

        try {
            let response = await fetch(`http://hepatest.kz/api/v1/doctors/${doctorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                    ...doctorData,
                    ...updatedDoctorData
                })
            });

            if (!response.ok && response.status === 401) {
                try {
                    console.log("GOT AN ERROR. REFRESHING.")
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://hepatest.kz/api/v1/doctors/${doctorId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                            ...doctorData,
                            ...updatedDoctorData
                        })
                    });

                    const updatedDoctorDataRecieved = await response.json();
                    const updatedDoctorsDoctorsData = doctorsData.map(doctor => {
                        if (doctor.id === updatedDoctorDataRecieved.id) {
                            return updatedDoctorDataRecieved;
                        }
                        return doctor;
                    });

                    let updatedSearchDoctorsResults = null;
                    if (searchDoctorsResults) {
                        updatedSearchDoctorsResults = searchDoctorsResults.map(doctor => {
                            if (doctor.id === updatedDoctorDataRecieved.id) {
                                return updatedDoctorDataRecieved;
                            }
                            return doctor;
                        });
                    }

                    setDoctorsData(updatedDoctorsDoctorsData);
                    setSearchDoctorsResults(updatedSearchDoctorsResults);
                    setDoctorData(updatedDoctorDataRecieved);
                    closeDoctorDataEditorHandle();
                } catch (error) {
                    const error_text = JSON.stringify(error);
                    console.log("SOMETHING WENT WRONG HERE 1: " + error_text)
                    handleLogout();
                }
            } else {
                const updatedDoctorDataRecieved = await response.json();
                const updatedDoctorsDoctorsData = doctorsData.map(doctor => {
                    if (doctor.id === updatedDoctorDataRecieved.id) {
                        return updatedDoctorDataRecieved;
                    }
                    return doctor;
                });

                let updatedSearchDoctorsResults = null;
                if (searchDoctorsResults) {
                    updatedSearchDoctorsResults = searchDoctorsResults.map(doctor => {
                        if (doctor.id === updatedDoctorDataRecieved.id) {
                            return updatedDoctorDataRecieved;
                        }
                        return doctor;
                    });
                }

                setDoctorsData(updatedDoctorsDoctorsData);
                setSearchDoctorsResults(updatedSearchDoctorsResults);
                setDoctorData(updatedDoctorDataRecieved);
                closeDoctorDataEditorHandle();
            }
        } catch (error) {
            const error_text = JSON.stringify(error);
            console.log("SOMETHING WENT WRONG HERE 2: " + error_text)
            console.log("An error occurred while trying to update the doctor data.")
        }
    };

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    if (dataLoading) {
        return (
            <div className="doctorDataEditorBox" style={{ display: "block" }}>
                <div className='doctorDataEditorHeaderBox'>
                    <img src={CloseIcon} className='closeDoctorDataEditorButton' alt='' onClick={closeDoctorDataEditorHandle} />
                </div>
                <div className='dataEditorLoader'></div>
            </div>
        );
    }

    return (
        <div className="doctorDataEditorBox">
            <div className='doctorDataEditorHeaderBox'>
                <img src={CloseIcon} className='closeDoctorDataEditorButton' alt='' onClick={closeDoctorDataEditorHandle} />
            </div>
            {doctorData && (
                <div className='doctorDataInputsList'>
                    <div className='doctorDataInputsWrapper' key='password'>
                        <label className='doctorDataLabel'>Пароль</label>
                        <input
                            className='doctorDataInput'
                            type='password'
                            placeholder='Введите новый пароль (необязательно)'
                            value={newPassword}
                            onChange={(event) => handleInputChange('password', event)}
                        />
                    </div>
                    {Object.entries(doctorData).map(([fieldKey, value]) => {
                        const field = fields[fieldKey];
                        if (field) {
                            if (field.type === 'enum') {
                                return (
                                    <div className='doctorDataInputsWrapper' key={fieldKey}>
                                        <label className='doctorDataLabel'>{field.translation || fieldKey}</label>
                                        <select className='doctorDataSelect' onChange={(event) => handleInputChange(fieldKey, event)} defaultValue={value}>
                                            {field.options.map(option => {
                                                if (typeof option === 'object') {
                                                    return Object.keys(option).map(key => (
                                                        <option key={key} value={key}>{key}</option>
                                                    ));
                                                } else {
                                                    return <option key={option} value={option}>{option}</option>
                                                }
                                            })}
                                        </select>
                                    </div>
                                );
                            } else if (field.type === 'input') {
                                return (
                                    <div className='doctorDataInputsWrapper' key={fieldKey}>
                                        <label className='doctorDataLabel'>{field.translation || fieldKey}</label>
                                        <input className='doctorDataInput' placeholder={value} onChange={(event) => handleInputChange(fieldKey, event)} />
                                    </div>
                                );
                            }
                        }
                    })}
                </div>
            )}
            <button className='doctorDataSaveButton' onClick={() => saveDoctorData()}>СОХРАНИТЬ</button>
            <p className='errorMessage'>{errorMessage}</p>
        </div>
    );
}

export default AdminDoctorDataEditor;
