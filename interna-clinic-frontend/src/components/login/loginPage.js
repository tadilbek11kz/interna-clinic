import './loginPage.scss';
import logoImage from './icons/favicon.ico';
import AuthContext from '../../auth/authContext';

import { Navigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';

const LoginPage = () => {
    const [form, setForm] = useState({
        userInput: '',
        password: '',
        role: 'Patient',
    });

    const { login, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);
    

    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            await login(form.userInput, form.password, form.role);
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('422')) {
                setErrorMessage("Ошибка авторизации. Проверьте данные, выбранную роль и попробуйте снова.");
            } else {
                setErrorMessage("Возникла какая-то ошибка, попробуйте позже.");
            }
        }
    };        

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className='loginPage'>
            <div className='loginWrapper'>
                <img className='logoImage' src={logoImage} alt=''></img>
                <div className="login_box">
                    <form className='loginForm' id="loginForm" onSubmit={handleSubmit}>
                    <label htmlFor="userInput">ИИН или имя пользователя:</label>
                    <input type="text" id="userInput" name="userInput" value={form.userInput} onChange={handleChange} /><br/>
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" id="password" name="password" value={form.password} onChange={handleChange} /><br/>
                    <br/><label htmlFor="role">Роль:</label>
                    <select id="role" name="role" value={form.role} onChange={handleChange}>
                        <option value="Patient">Пациент</option>
                        <option value="Doctor">Доктор</option>
                        <option value="Admin">Администратор</option>
                    </select><br/>
                    <button className='submitButton' type="submit"> Войти </button>
                    </form>
                    {errorMessage && <p className='loginErrorMessage'>{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
