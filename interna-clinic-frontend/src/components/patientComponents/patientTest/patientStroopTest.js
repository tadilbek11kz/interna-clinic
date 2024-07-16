import './patientTest.scss';
import AuthContext from '../../../auth/authContext';

import { Navigate, Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';

const PatientStroopTest = ({ patientIIN }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [dataLoading, setDataLoading] = useState(true);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [time, setTime] = useState(0.0);
    const [running, setRunning] = useState(false);
    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [testStarted, setTestStarted] = useState(false);
    const [testFinished, setTestFinished] = useState(false);
    const colorNames = ['Красный', 'Зелёный', 'Синий', 'Жёлтый', 'Черный']
    const colorCodes = ['red', 'green', 'blue', 'yellow', 'black']

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);

    useEffect(() => {
        if (wrong + correct === 20) {
            stopTest();
        }
    }, [wrong, correct]);

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
            name: 'Stroop Test',
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


    const generateColor = () => {
        const randomColor = colorCodes[Math.floor(Math.random() * 5)];
        const randomName = colorNames[Math.floor(Math.random() * 5)];
        setColor(randomColor);
        setName(randomName);
    }

    const startTest = () => {
        setTestStarted(true);
        setRunning(true);
        setTestFinished(false);
        setResults([]);
        setCorrect(0);
        setWrong(0);
        setTime(0.0);
        generateColor();
    }

    const stopTest = () => {
        setRunning(false);
        setTestFinished(true);
        setShowResults(true);
        addTestToDb();
    }

    const checkAnswer = (answer) => {
        if (answer === color) {
            setCorrect(correct + 1);
        } else {
            setWrong(wrong + 1);
        }

        setResults([...results, { name, color, answer }]);
        generateColor();
    }

    const handleAnswer = (e) => {
        if (running) {
            checkAnswer(e.target.style.color);
        }
    }

    const handleStartButton = () => {
        if (!testStarted) {
            startTest();
        } else if (testFinished) {
            startTest();
        }
    }

    if (running && results.length > 0) {
        setTimeout(() => {
            setTime(time + 0.1);
        }, 100);
    }

    return (
        <div className='stroopTest'>
            <h1 className='dataSectionTitle'>Тест Струпа</h1>
            <hr className='dataSectionDividerLineStart' />
            <p className='dataSectionDescription'>
                При выполнении тестов необходимо соблюдать следующие правила: <br />
                <br />1. Выберите удобное для себя время дня для проведения теста
                <br />2. Вы должны располагать по меньшей мере 10 свободными минутами
                <br />3. При проведении теста необходима спокойная обстановка; попросите окружающих Вас не отвлекать во избежание ошибок
                <br />4. Займите положение, удобное для введения информации в телефон (айпад, компьютер), удобный стул и достаточное освещение
                <br />5. Перед выполнением теста отдохните в течение 3-5 минут
                <br />
                <br /><strong>Тест Струпа</strong>
                <br />
                <br />В данном тесте, в середине поля вы увидите слова, обозначающие цвета (<i>КРАСНЫЙ, ЧЕРНЫЙ, СИНИЙ, ЗЕЛЕНЫЙ, ЖЕЛТЫЙ</i>), написанные разными цветами. Под этими словами располагаются кнопки разных цветов. Вам следует нажать на кнопку, того цвета, которым написано слово (например, если написано «<a style={{ color: 'green' }}>КРАСНЫЙ</a>» зелеными буквами, то нужно нажать на ЗЕЛЕНУЮ кнопку). Тест выполняется на время.
            </p>
            <div className='testWrapper'>
                {testStarted && !testFinished &&
                    <div className='testArea'>
                        <div className='timer'>Время: {time.toFixed(1)} секунд</div>
                        <div className='color' style={{ color: color }}>{name}</div>

                        <ul className='testControls'>
                            <li className='testControls__element' style={{ color: colorCodes[0], borderColor: colorCodes[0] }} onClick={handleAnswer}>{colorNames[0]}</li>
                            <li className='testControls__element' style={{ color: colorCodes[1], borderColor: colorCodes[1] }} onClick={handleAnswer}>{colorNames[1]}</li>
                            <li className='testControls__element' style={{ color: colorCodes[2], borderColor: colorCodes[2] }} onClick={handleAnswer}>{colorNames[2]}</li>
                            <li className='testControls__element' style={{ color: colorCodes[3], borderColor: colorCodes[3] }} onClick={handleAnswer}>{colorNames[3]}</li>
                            <li className='testControls__element' style={{ color: colorCodes[4], borderColor: colorCodes[4] }} onClick={handleAnswer}>{colorNames[4]}</li>
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
                        <p>Верно: {correct}</p>
                        <p>Неверно: {wrong}</p>
                        <p>Время: {time.toFixed(1)} секунд</p>
                    </div>
                }
            </div>
            <p className='errorMessage'>{errorMessage}</p>
        </div>
    );
}

export default PatientStroopTest;