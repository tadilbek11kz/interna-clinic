import { useContext, useEffect, useRef, useState } from 'react';
import './adminAddDoctorMenu.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';

const AdminAddDoctorMenu = ({ closeAddDoctorMenuHandle, doctorsData, setDoctorsData }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fields = {
        // REQUIRED
        first_name: { type: 'input', translation: 'Имя', required: true, data_type: 'str' },
        last_name: { type: 'input', translation: 'Фамилия', required: true, data_type: 'str' },
        middle_name: { type: 'input', translation: 'Отчество', required: true, data_type: 'str' },
        IIN: { type: 'input', translation: 'ИИН', required: true, data_type: 'int' },
        password: { type: 'input', translation: 'Пароль', required: true, data_type: 'str' },
        gender: { type: 'enum', options: ['Мужской', 'Женский'], translation: 'Пол', required: true, data_type: 'str' },
        age: { type: 'input', translation: 'Возраст', required: true, data_type: 'int' },
        // qualification: {type: 'enum', options: ['Гастроэнтеролог'], translation: 'Выберите квалификацию', required: true, data_type: 'str'} - Автоматически присваивается ниже    
    }

    const [formData, setFormData] = useState(() => {
        const initialData = {};

        Object.keys(fields).forEach((fieldKey) => {
            const field = fields[fieldKey];

            switch (field.data_type) {
                case 'str':
                    initialData[fieldKey] = '';
                    break;
                case 'int':
                    initialData[fieldKey] = field.required ? '' : 0;
                    break;
                default:
                    initialData[fieldKey] = '';
            }
        }
        );

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
                switch (field.data_type) {
                    case 'int':
                        updatedValue = 0;
                        break;
                    default:
                        updatedValue = '';
                }
            }

            const updatedFormData = { ...prevFormData, [fieldName]: updatedValue };
            return updatedFormData;
        });
    };

    useEffect(() => {
        console.log("FORM DATA: " + JSON.stringify(formData));
    }, [formData]);

    const areAllFieldsValid = (doctorToAddFinalData, fields) => {
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
                    if (key === 'IIN') {
                        if (!/^\d{12}$/.test(data[key])) {
                            console.log("OOOPS ERROR HERE")
                            throw new Error(`Поле '${fieldTranslation}' должно содержать ровно 12 цифр.`);
                        }
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

    const addDoctorToDb = async () => {
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

        const doctorToAddFinalData = {
            ...formData,
            qualification: 'Гастроэнтеролог',
        };

        try {
            let response = await fetch(`http://hepatest.kz/api/v1/doctors/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                    ...doctorToAddFinalData
                })
            });

            if (!response.ok && response.status === 401) {
                try {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://hepatest.kz/api/v1/doctors/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                            ...doctorToAddFinalData
                        })
                    });

                    const recievedDoctorData = await response.json()
                    closeAddDoctorMenuHandle();
                    setDoctorsData([recievedDoctorData, ...doctorsData])
                } catch (error) {
                    handleLogout();
                }
            } else {
                console.log("\n\n\n\n\nRESPONSE STATUS: " + response.status)
                switch (response.status) {
                    case 422:
                        setErrorMessage('Ошибка при добавлении врача. Проверьте все поля.');
                        break;
                    case 409:
                        setErrorMessage('Врач с таким ИИН уже существует в базе данных.');
                        break;
                    case 500:
                        setErrorMessage('Возникла какая-то ошибка. Попробуйте позже.');
                        break;
                    default:
                        const recievedDoctorData = await response.json()
                        closeAddDoctorMenuHandle();
                        setDoctorsData([recievedDoctorData, ...doctorsData])
                        closeAddDoctorMenuHandle();
                }
            }
        } catch (error) {
            console.log("An error ocured while trying to fetch the doctor data.")
        }
    };


    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className="adminAddDoctorMenuBox">
            <div className='adminAddDoctorMenuHeaderBox'>
                <img src={CloseIcon} className='closeAdminAddDoctorMenuButton' alt='' onClick={closeAddDoctorMenuHandle} />
            </div>
            <div className='doctorDataInputsList'>
                {Object.keys(fields).map((fieldKey) => {
                    const field = fields[fieldKey];
                    if (field.type === 'enum') {
                        return (
                            <div className='doctorDataInputsWrapper' key={fieldKey}>
                                <label className='doctorDataLabel'>{field.translation || fieldKey}</label>
                                <select className={`doctorDataSelect ${!field.required ? '' : 'not-selected'}`} onChange={(event) => handleInputChange(fieldKey, event)}>
                                    {field.default
                                        ? <option value={field.default}>{field.default}</option>
                                        : <option value="">Выберите опцию...</option>
                                    }
                                    {field.options.map(option => {
                                        if (typeof option === 'object') {
                                            return Object.keys(option).map(key => (
                                                <option key={key} value={key}>{key}</option>
                                            ));
                                        } else if (option !== field.default) {
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
                                <input className={`doctorDataInput ${!field.required ? '' : 'not-selected'}`} onChange={(event) => handleInputChange(fieldKey, event)} />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <button className='addDoctorButton' onClick={() => addDoctorToDb()}>ДОБАВИТЬ ВРАЧА</button>
            <p className='errorMessage'>{errorMessage}</p>
        </div>
    );
}

export default AdminAddDoctorMenu;
