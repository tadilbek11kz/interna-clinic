import './patientTest.scss';
import AuthContext from '../../../auth/authContext';

import { Navigate, Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';

const PatientTest = ({ patientIIN }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);

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

        const fetchPatientData = async () => {
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
        };

        fetchPatientData();
        setDataLoading(false);
    }, [patientIIN, refresh, setIsAuthenticated, setRedirectTo]);

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    };

    if (dataLoading) {
        return (
            <div className='loader'></div>
        );
    };

    return (
        <div className='patientTest'>
            <h1 className='dataSectionTitle'>Доступные тесты</h1>
            <hr className='dataSectionDividerLineStart' />
            <p className='dataSectionDescription'>Уважаемый пациент! <br />
                Вам предлагается последовательно пройти три теста: Тест Струпа, Тест чисел и символов и Тест связи чисел. С помощью этих тестов можно оценить состояние центральной нервной системы, деятельность которой нарушается при заболеваниях печени. Это может ухудшить Вашу повседневную жизнь и прогноз заболевания. Результаты тестов помогут врачу сделать объективное заключение по Вашему состоянию и провести необходимую коррекцию лечения.</p>
            <div className='patientAvailableTestsWrapper'>
                <div className='sectionNavigation'>
                    <Link to={`/patient/${patientIIN}/tests/stroop`} className='sectionNavigation__element'>Тест Струпа</Link>
                    <Link to={`/patient/${patientIIN}/tests/dst`} className='sectionNavigation__element'>Тест чисел и символов</Link>
                    <Link to={`/patient/${patientIIN}/tests/connection`} className='sectionNavigation__element'>Тест связи чисел</Link>
                </div>
            </div>
        </div>
    );
}

export default PatientTest;