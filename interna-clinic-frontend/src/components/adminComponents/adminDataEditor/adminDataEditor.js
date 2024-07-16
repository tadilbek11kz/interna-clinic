import { useContext, useEffect, useState } from 'react';
import './adminDataEditor.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';

const AdminDataEditor = ({ closeAdminDataEditorHandle, adminId, adminsData, setAdminsData, searchAdminsResults, setSearchAdminsResults }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [adminData, setAdminData] = useState({});
    const [updatedAdminData, setUpdatedAdminData] = useState(adminData);
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fields = {
        // REQUIRED
        first_name: { type: 'input', translation: 'Имя', required: true, data_type: 'str' },
        last_name: { type: 'input', translation: 'Фамилия', required: true, data_type: 'str' },
        middle_name: { type: 'input', translation: 'Отчество', required: true, data_type: 'str' },
        username: { type: 'input', translation: 'Имя пользователя', required: true, data_type: 'str' },
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

        const fetchAdminData = async () => {
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
                let response = await fetch(`http://hepatest.kz/api/v1/admins/${adminId}`, {
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
                        response = await fetch(`http://hepatest.kz/api/v1/admins/${adminId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const adminData = await response.json();
                        setAdminData(adminData);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const adminData = await response.json();
                    setAdminData(adminData);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the admin data.")
            }
        }

        fetchAdminData();
    }, [adminId, refresh, setIsAuthenticated, setRedirectTo])

    const handleInputChange = (fieldName, event) => {
        let updatedValue = event.target.value;

        setAdminData(prevAdminData => {
            let updatedAdminData = { ...prevAdminData };

            if (updatedValue === '') {
                updatedValue = '';
            }

            if (fieldName === 'password') {
                setNewPassword(updatedValue)
                updatedAdminData['password'] = updatedValue;
            } else {
                updatedAdminData[fieldName] = updatedValue;
            }

            return updatedAdminData;
        });
    };

    useEffect(() => {
        console.log("ADMIN DATA: " + JSON.stringify(adminData));
    }, [adminData]);

    const areAllFieldsValid = (adminToAddFinalData, fields) => {
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

                    if ((key === 'first_name' || key === 'last_name' || key === 'middle_name') && data[key] === '') {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' не может быть пустым.`);
                    }
                }
            }
        };

        try {
            traverseFields(adminToAddFinalData, '');
        } catch (error) {
            console.error(error.message);
            console.log("ERROR FIELD: " + error.message.split(' ')[1])
            return error.message;
        }
    };

    const saveAdminData = async () => {
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
            updatedAdminData['password'] = '';
        }

        console.log("FINAL ADMIN DATA: " + JSON.stringify({ ...adminData, ...updatedAdminData }));
        const errorFieldMessage = areAllFieldsValid({ ...adminData, ...updatedAdminData }, fields);
        if (errorFieldMessage) {
            setErrorMessage(errorFieldMessage);
            return;
        }

        try {
            let response = await fetch(`http://hepatest.kz/api/v1/admins/${adminId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                    ...adminData,
                    ...updatedAdminData
                })
            });

            if (!response.ok && response.status === 401) {
                try {
                    console.log("GOT AN ERROR. REFRESHING.")
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://hepatest.kz/api/v1/admins/${adminId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                            ...adminData,
                            ...updatedAdminData
                        })
                    });

                    const updatedAdminDataRecieved = await response.json();
                    const updatedAdminsAdminsData = adminsData.map(admin => {
                        if (admin.id === updatedAdminDataRecieved.id) {
                            return updatedAdminDataRecieved;
                        }
                        return admin;
                    });

                    let updatedSearchAdminsResults = null;
                    if (searchAdminsResults) {
                        updatedSearchAdminsResults = searchAdminsResults.map(admin => {
                            if (admin.id === updatedAdminDataRecieved.id) {
                                return updatedAdminDataRecieved;
                            }
                            return admin;
                        });
                    }

                    setAdminsData(updatedAdminsAdminsData);
                    setSearchAdminsResults(updatedSearchAdminsResults);
                    setAdminData(updatedAdminDataRecieved);
                    closeAdminDataEditorHandle();
                } catch (error) {
                    const error_text = JSON.stringify(error);
                    console.log("SOMETHING WENT WRONG HERE 1: " + error_text)
                    handleLogout();
                }
            } else {
                const updatedAdminDataRecieved = await response.json();
                const updatedAdminsAdminsData = adminsData.map(admin => {
                    if (admin.id === updatedAdminDataRecieved.id) {
                        return updatedAdminDataRecieved;
                    }
                    return admin;
                });

                let updatedSearchAdminsResults = null;
                if (searchAdminsResults) {
                    updatedSearchAdminsResults = searchAdminsResults.map(admin => {
                        if (admin.id === updatedAdminDataRecieved.id) {
                            return updatedAdminDataRecieved;
                        }
                        return admin;
                    });
                }

                setAdminsData(updatedAdminsAdminsData);
                setSearchAdminsResults(updatedSearchAdminsResults);
                setAdminData(updatedAdminDataRecieved);
                closeAdminDataEditorHandle();
            }
        } catch (error) {
            const error_text = JSON.stringify(error);
            console.log("SOMETHING WENT WRONG HERE 2: " + error_text)
            console.log("An error occurred while trying to update the admin data.")
        }
    };

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    if (dataLoading) {
        return (
            <div className="adminDataEditorBox" style={{ display: "block" }}>
                <div className='adminDataEditorHeaderBox'>
                    <img src={CloseIcon} className='closeAdminDataEditorButton' alt='' />
                </div>
                <div className='dataEditorLoader'></div>
            </div>
        );
    }

    return (
        <div className="adminDataEditorBox">
            <div className='adminDataEditorHeaderBox'>
                <img src={CloseIcon} className='closeAdminDataEditorButton' alt='' onClick={closeAdminDataEditorHandle} />
            </div>
            {adminData && (
                <div className='adminDataInputsList'>
                    <div className='adminDataInputsWrapper' key='password'>
                        <label className='adminDataLabel'>Пароль</label>
                        <input
                            className='adminDataInput'
                            type='password'
                            placeholder='Введите новый пароль (необязательно)'
                            value={newPassword}
                            onChange={(event) => handleInputChange('password', event)}
                        />
                    </div>
                    {Object.entries(adminData).map(([fieldKey, value]) => {
                        const field = fields[fieldKey];
                        if (field) {
                            if (field.type === 'enum') {
                                return (
                                    <div className='adminDataInputsWrapper' key={fieldKey}>
                                        <label className='adminDataLabel'>{field.translation || fieldKey}</label>
                                        <select className='adminDataSelect' onChange={(event) => handleInputChange(fieldKey, event)} defaultValue={value}>
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
                                    <div className='adminDataInputsWrapper' key={fieldKey}>
                                        <label className='adminDataLabel'>{field.translation || fieldKey}</label>
                                        <input className='adminDataInput' placeholder={value} onChange={(event) => handleInputChange(fieldKey, event)} />
                                    </div>
                                );
                            }
                        }
                    })}
                </div>
            )}
            <button className='adminDataSaveButton' onClick={() => saveAdminData()}>СОХРАНИТЬ</button>
            <p className='errorMessage'>{errorMessage}</p>
        </div>
    );
}

export default AdminDataEditor;
