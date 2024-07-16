import './patientTest.scss';
import AuthContext from '../../../auth/authContext';

import { Navigate, Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import symbols from './symbols/symbols';

const PatientDSTest = ({ patientIIN }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [time, setTime] = useState(0.0);
    const [running, setRunning] = useState(false);
    const [symbol, setSymbol] = useState('');
    const [symbolIndex, setSymbolIndex] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [testFinished, setTestFinished] = useState(false);
    const [wrongBlink, setWrongBlink] = useState(false);

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);

    useEffect(() => {
        if (correct === 20) {
            stopTest();
        };
    }, [correct]);

    const addTestToDb = async () => {
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

        const testToAddFinalData = {
            name: 'DST',
            time: time.toFixed(1),
            correct: correct,
            wrong: wrong,
        };

        try {
            let response = await fetch(`http://hepatest.kz/api/v1/patients/${patientIIN}/test/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                    ...testToAddFinalData
                })
            });

            if (!response.ok && response.status === 401) {
                try {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://hepatest.kz/api/v1/patients/${patientIIN}/test/create`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                            ...testToAddFinalData
                        })
                    });

                } catch (error) {
                    handleLogout();
                }
            } else {
                switch (response.status) {
                    case 422:
                        setErrorMessage('Ошибка при добавлении теста.');
                        break;
                    case 500:
                        setErrorMessage('Возникла какая-то ошибка. Попробуйте позже.');
                        break;
                    default:
                        break
                }
            }
        } catch (error) {
            setErrorMessage("An error ocured while trying to create the test data.")
        }
    };


    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }


    const generateSymbol = () => {
        const index = Math.floor(Math.random() * 8) + 1;
        const randomSymbol = symbols[index];
        setSymbol(randomSymbol);
        setSymbolIndex(index)
    }

    const startTest = () => {
        setTestStarted(true);
        setRunning(true);
        setTestFinished(false);
        setCorrect(0);
        setWrong(0);
        setTime(0.0);
        generateSymbol();
    }

    const stopTest = () => {
        setRunning(false);
        setTestFinished(true);
        setShowResults(true);
        addTestToDb();
    }

    const checkAnswer = (answer) => {
        if (answer === symbolIndex.toString()) {
            setCorrect(correct + 1);
        } else {
            setWrong(wrong + 1);
            setWrongBlink(true);
            setTimeout(() => {
                setWrongBlink(false);
            }, 1000);
            return;
        }

        generateSymbol();
    }

    const handleAnswer = (e) => {
        if (running) {
            checkAnswer(e.target.innerText);
        }
    }

    const handleStartButton = () => {
        if (!testStarted) {
            startTest();
        } else if (testFinished) {
            startTest();
        }
    }

    if (running && correct + wrong > 0) {
        setTimeout(() => {
            setTime(time + 0.1);
        }, 100);
    }


    return (
        <div className='dsTest'>
            <h1 className='dataSectionTitle'>Тест Чисел и Символов</h1>
            <hr className='dataSectionDividerLineStart' />
            <p className='dataSectionDescription'>
                При выполнении тестов необходимо соблюдать следующие правила: <br />
                <br />1. Выберите удобное для себя время дня для проведения теста
                <br />2. Вы должны располагать по меньшей мере 10 свободными минутами
                <br />3. При проведении теста необходима спокойная обстановка; попросите окружающих Вас не отвлекать во избежание ошибок
                <br />4. Займите положение, удобное для введения информации в телефон (айпад, компьютер), удобный стул и достаточное освещение
                <br />5. Перед выполнением теста отдохните в течение 3-5 минут
                <br />
                <br />
                <strong>Тест чисел и символов</strong>
                <br />
                <br />
                В данном тесте в середине поля будут появляться различные символы. Ниже вы увидите кнопки с цифрами от 1 до 8. Каждая цифра соответствует определенному символу. Вам нужно будет нажимать на кнопку, соответствующую символу, который появляется перед вами в центре поля. Если символ загорается красным цветом, значит была допущена ошибка и необходимо выбрать правильную кнопку. Тест выполняется на время.

            </p>
            <div className='testWrapper'>
                {testStarted && !testFinished &&
                    <div className='testArea'>
                        <div className='timer'>Время: {time.toFixed(1)} секунд</div>
                        <img className={`symbol ${wrongBlink ? 'wrong' : ''}`} src={symbol} />

                        <ul className='testControls'>
                            {Object.keys(symbols).map((key, index) => {
                                return (
                                    <div key={key}>
                                        <img src={symbols[key]}></img>
                                        <li className='testControls__element' onClick={handleAnswer}>{key}</li>
                                    </div>
                                );
                            }
                            )}
                        </ul>
                    </div>
                }

                {!testStarted &&
                    <div className='testControls'>
                        <li className='testControls__element' onClick={handleStartButton}>{testStarted ? 'Начать заново' : 'Начать тест'}</li>
                    </div>
                }
                {showResults &&
                    <div className='testResults'>
                        <h2>Результаты теста</h2>
                        <p>Ошибки: {wrong}</p>
                        <p>Время: {time.toFixed(1)} секунд</p>
                    </div>
                }
            </div>
        </div>
    );
}

export default PatientDSTest;