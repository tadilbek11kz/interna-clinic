import './patientPage.scss';
import PatientHeader from '../patientHeader/patientHeader';
import PatientMain from '../patientMain/patientMain';
import PatientTest from '../patientTest/patientTest';
import PatientStroopTest from '../patientTest/patientStroopTest';
import PatientDSTest from '../patientTest/patientDSTest';
import PatientConnectionTest from '../patientTest/patientConnectionTest';
import { Route, Routes, useParams } from 'react-router-dom';
import React from 'react';

const PatientPage = () => {
    const { patientIIN } = useParams();

    return (
        <div className='patientPage'>
            <PatientHeader patientIIN={patientIIN} />
            <Routes>
                <Route path={`account/*`} element={<PatientMain patientIIN={patientIIN} />} />
                <Route path={`tests/*`} element={<PatientTest patientIIN={patientIIN} />} />
                <Route path={`tests/stroop/*`} element={<PatientStroopTest patientIIN={patientIIN} />} />
                <Route path={`tests/dst/*`} element={<PatientDSTest patientIIN={patientIIN} />} />
                <Route path={`tests/connection/*`} element={<PatientConnectionTest patientIIN={patientIIN} />} />
            </Routes>
        </div>
    );
}

export default PatientPage;
