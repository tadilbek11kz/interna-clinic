import './patientTest.scss';
import AuthContext from '../../../auth/authContext';

import { Navigate, Link } from "react-router-dom";
import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';


const PatientConnectionTest = ({ patientIIN }) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [wrong, setWrong] = useState(0);
    const [time, setTime] = useState(0.0);
    const [running, setRunning] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [testFinished, setTestFinished] = useState(false);
    const [currentNumber, setCurrentNumber] = useState(1);
    const [matrixWidth, setMatrixWidth] = useState(0);
    const [items, setItems] = useState([]);
    const [wrongBlink, setWrongBlink] = useState(-1);

    const defaultMatrix = {
        width: 2500,
        height: 2100,
        circleRadius: 120,
    };

    const boxRef = useRef(null);

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
            name: 'Connect Dot Test',
            time: time.toFixed(1),
            correct: 25,
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

    const getRandomNumber = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const generateItems = (matrixOptions) => {

        const { width, height, circleRadius } = matrixOptions;
        const distanceFromBorder = circleRadius + 15;

        const getIntervalExtremum = (coord, maxDistance, type) => {
            let coordExtremum;

            if (type === 'min') {
                coordExtremum = coord - maxDistance * 0.3;

                return coordExtremum > distanceFromBorder ? coordExtremum : distanceFromBorder;
            }

            coordExtremum = coord + maxDistance * 0.3;

            return coordExtremum < maxDistance - distanceFromBorder
                ? coordExtremum
                : maxDistance - distanceFromBorder;
        };

        let items = [
            {
                active: true,
                coordX: getRandomNumber(
                    matrixOptions.width * 0.3,
                    matrixOptions.width * (1 - 0.3),
                ),
                coordY: getRandomNumber(
                    matrixOptions.height * 0.3,
                    matrixOptions.height * (1 - 0.3),
                ),
                number: 1,
                text: '1',
            },
        ];

        for (let i = 1; i < 25; i++) {
            let interval = {
                width: {
                    min: getIntervalExtremum(items[i - 1].coordX, width, 'min'),
                    max: getIntervalExtremum(items[i - 1].coordX, width, 'max'),
                },
                height: {
                    min: getIntervalExtremum(items[i - 1].coordY, height, 'min'),
                    max: getIntervalExtremum(items[i - 1].coordY, height, 'max'),
                },
            };

            let coordX;
            let coordY;
            let numberIterations = 0;

            while (true) {
                if (numberIterations > 100) {
                    interval = {
                        width: { min: distanceFromBorder, max: width - distanceFromBorder },
                        height: { min: distanceFromBorder, max: height - distanceFromBorder },
                    };
                }

                coordX = getRandomNumber(interval.width.min, interval.width.max);
                coordY = getRandomNumber(interval.height.min, interval.height.max);

                let badCoords = false;

                for (let j = 0; j < items.length; j++) {
                    const distance = Math.sqrt(
                        Math.pow(items[j].coordX - coordX, 2) + Math.pow(items[j].coordY - coordY, 2),
                    );

                    if (distance < circleRadius * 3) {
                        badCoords = true;
                        break;
                    }
                }

                if (badCoords) {
                    numberIterations += 1;
                    continue;
                }

                break;
            }

            let text = String(i + 1);

            items.push({
                active: false,
                coordX: coordX,
                coordY: coordY,
                number: i + 1,
                text,
            });
        }

        return items;
    }



    const matrix = useMemo(() => {
        const initMatrix = {
            width: matrixWidth,
            height: Math.round((defaultMatrix.height * matrixWidth) / defaultMatrix.width),
            circleRadius: Math.round((defaultMatrix.circleRadius * matrixWidth) / defaultMatrix.width),
        };

        const initMatrixItems = generateItems(defaultMatrix).map((item) => ({
            coordX:
                Math.round((item.coordX * initMatrix.width) / defaultMatrix.width) -
                initMatrix.circleRadius,
            coordY:
                Math.round((item.coordY * initMatrix.height) / defaultMatrix.height) -
                initMatrix.circleRadius,
            active: item.active,
            number: item.number,
            text: item.text,
        }));

        setItems(initMatrixItems);

        return initMatrix;
    }, [matrixWidth]);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);


    useEffect(() => {
        if (boxRef.current) {
            setMatrixWidth(boxRef.current.clientWidth);
        }
    }, [windowSize.width]);


    useEffect(() => {
        let timer;
        if (running) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + 0.1);
            }, 100);
        }
        return () => clearInterval(timer);
    }, [running]);

    const startTest = () => {
        setTestStarted(true);
        setTestFinished(false);
        setWrong(0);
        setTime(0.0);
        setCurrentNumber(1);
        setShowResults(false);
    };

    const stopTest = () => {
        setRunning(false);
        setTestFinished(true);
        setShowResults(true);
        addTestToDb();
    };


    const handleNumberClick = (number) => {
        if (running === false) {
            setRunning(true);
        }

        if (!getItemByNumber(number - 1).active) {
            setWrong(wrong + 1);
            setWrongBlink(number);
            setTimeout(() => {
                setWrongBlink(-1);
            }, 1000);
            return;
        };


        const newItems = items.map((item) =>
            item.number === number ? { ...item, active: true } : item,
        );

        setItems(newItems);

        if (newItems[items.length - 1].active) {
            stopTest();
        }
    };

    const handleStartButton = () => {
        startTest();
    };

    const getItemByNumber = (number) => {
        return items.find((item) => item.number === number) || items[0];
    };


    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className='connectionTest'>
            <h1 className='dataSectionTitle'>Тест Чисел по Порядку</h1>
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
                <strong>Тест связи чисел</strong>
                <br />
                <br />
                Перед началом теста перед Вами на экране появятся цифры от 1 до 25, разбросанные в случайном порядке. Вам необходимо в порядке возрастания последовательно нажать на все цифры на экране. Если цифра загорелась красным цветом, значит была допущена ошибка и нужно найти правильную цифру. Тест выполняется на время.
            </p>
            <div className='testWrapper' ref={boxRef}>
                {testStarted && !testFinished &&
                    <div className='testArea'>
                        <div className='timer'>Время: {time.toFixed(1)} секунд</div>
                        <svg
                            className='testSVG'
                            width={matrix.width}
                            height={matrix.height}
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink">
                            {items.map((item) => (
                                <g key={item.number} style={{ display: testStarted ? '' : 'none' }}>
                                    {item.number !== items[items.length - 1].number && (
                                        <line
                                            className={`line ${getItemByNumber(item.number + 1).active ? 'lineActive' : ''}`}
                                            x1={item.coordX + matrix.circleRadius}
                                            y1={item.coordY + matrix.circleRadius}
                                            x2={getItemByNumber(item.number + 1).coordX + matrix.circleRadius}
                                            y2={getItemByNumber(item.number + 1).coordY + matrix.circleRadius}
                                        />
                                    )}
                                    <g
                                        className={`item ${item.active ? 'itemActive' : ''}`}
                                        transform={`matrix(1,0,0,1,${item.coordX},${item.coordY})`}
                                        onClick={() => handleNumberClick(item.number)}>
                                        <circle
                                            className={`circle ${item.number === wrongBlink ? 'itemWrong' : ''}`}
                                            r={matrix.circleRadius}
                                            cx={matrix.circleRadius}
                                            cy={matrix.circleRadius}
                                        />
                                        <text
                                            dx={matrix.circleRadius}
                                            dy={matrix.circleRadius * 1.25}
                                            className='text'
                                            style={{ fontSize: (matrix.circleRadius / 4) * 3 }}>
                                            {item.text}
                                        </text>
                                    </g>
                                </g>
                            ))}
                        </svg>
                    </div>

                }

                {!testStarted &&
                    <div className='testControls'>
                        <li className='testControls__element' onClick={handleStartButton}>
                            {testStarted ? 'Начать заново' : 'Начать тест'}
                        </li>
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

export default PatientConnectionTest;
