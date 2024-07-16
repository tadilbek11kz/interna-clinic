import { useContext, useEffect, useRef, useState } from 'react';
import './addAdminMenu.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';

const AdminAddAdminMenu = ({ closeAddAdminMenuHandle, adminsData, setAdminsData }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fields = {
        // REQUIRED
        first_name: { type: 'input', translation: 'Имя', required: true, data_type: 'str' },
        last_name: { type: 'input', translation: 'Фамилия', required: true, data_type: 'str' },
        middle_name: { type: 'input', translation: 'Отчество', required: true, data_type: 'str' },
        username: { type: 'input', translation: 'Имя пользователя', required: true, data_type: 'str' },
        password: { type: 'input', translation: 'Пароль', required: true, data_type: 'str' },
    }

    const [formData, setFormData] = useState(() => {
        const initialData = {};

        Object.keys(fields).forEach((fieldKey) => {
            initialData[fieldKey] = '';
        });

        return initialData;
    });

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);

    const handleInputChange = (fieldName, event) => {
        const field = fields[fieldName]

        if (event.target.value !== "" && field.required) {
            event.target.classList.remove('not-selected');
        }

        if (event.target.value === "" && field.required) {
            event.target.classList.add('not-selected');
        }

        setFormData(prevFormData => {
            let updatedValue = event.target.value;

            if (updatedValue === '' && !field.required) {
                updatedValue = '';
            }

            const updatedFormData = { ...prevFormData, [fieldName]: updatedValue };
            return updatedFormData;
        });
    };

    useEffect(() => {
        console.log("FORM DATA: " + JSON.stringify(formData));
    }, [formData]);

    const areAllFieldsValid = (adminToAddFinalData, fields) => {
        const traverseFields = (data, fieldPath) => {
            for (let key in data) {
                console.log("CHECKING... " + key + " | VALUE: " + data[key])
                if (Array.isArray(data[key])) {
                    const fieldTranslation = fields[key]?.translation || key;

                    if (fields[key]?.required && data[key].length === 0) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' является обязательным и должно быть заполнено.`);
                    }
                } else if (typeof data[key] === 'object' && data[key] !== null) {
                    console.log("IT SEEMS LIKE IT'S OBJECT, OBVIOUSLY...")
                    traverseFields(data[key], fieldPath ? `${fieldPath}.${key}` : key);
                } else {
                    const fieldTranslation = fields[key]?.translation || key;

                    if (fields[key]?.required && (data[key] === undefined || data[key] === null || data[key] === '' || (Array.isArray(data[key]) && data[key].length === 0))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' является обязательным и должно быть заполнено.`);
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

    const addAdminToDb = async () => {
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

        const errorFieldMessage = areAllFieldsValid(formData, fields);
        if (errorFieldMessage) {
            setErrorMessage(errorFieldMessage);
            return;
        }

        const adminToAddFinalData = {
            ...formData,
            qualification: 'Гастроэнтеролог',
        };

        try {
            let response = await fetch(`http://hepatest.kz/api/v1/admins/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                    ...adminToAddFinalData
                })
            });

            if (!response.ok && response.status === 401) {
                try {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://hepatest.kz/api/v1/admins/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                            ...adminToAddFinalData
                        })
                    });

                    const recievedAdminData = await response.json()
                    closeAddAdminMenuHandle();
                    setAdminsData([recievedAdminData, ...adminsData])
                } catch (error) {
                    handleLogout();
                }
            } else {
                console.log("\n\n\n\n\nRESPONSE STATUS: " + response.status)
                switch (response.status) {
                    case 422:
                        setErrorMessage('Ошибка при добавлении администратора. Проверьте все поля.');
                        break;
                    case 409:
                        setErrorMessage('Администратор с таким ИИН уже существует в базе данных.');
                        break;
                    case 500:
                        setErrorMessage('Возникла какая-то ошибка. Попробуйте позже.');
                        break;
                    default:
                        const recievedAdminData = await response.json()
                        closeAddAdminMenuHandle();
                        setAdminsData([recievedAdminData, ...adminsData])
                        closeAddAdminMenuHandle();
                }
            }
        } catch (error) {
            console.log("An error ocured while trying to fetch the admin data.")
        }
    };


    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className="adminAddAdminMenuBox">
            <div className='adminAddAdminMenuHeaderBox'>
                <img src={CloseIcon} className='closeAdminAddAdminMenuButton' alt='' onClick={closeAddAdminMenuHandle} />
            </div>
            <div className='adminDataInputsList'>
                {Object.keys(fields).map((fieldKey) => {
                    const field = fields[fieldKey];
                    return (
                        <div className='adminDataInputsWrapper' key={fieldKey}>
                            <label className='adminDataLabel'>{field.translation || fieldKey}</label>
                            <input className={`adminDataInput ${!field.required ? '' : 'not-selected'}`} onChange={(event) => handleInputChange(fieldKey, event)} />
                        </div>
                    );
                })}
            </div>
            <button className='addAdminButton' onClick={() => addAdminToDb()}>ДОБАВИТЬ АДМИНИСТРАТОРА</button>
            <p className='errorMessage'>{errorMessage}</p>
        </div>
    );
}

export default AdminAddAdminMenu;
