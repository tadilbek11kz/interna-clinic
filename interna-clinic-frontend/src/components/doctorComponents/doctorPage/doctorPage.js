import './doctorPage.scss';
import DoctorHeader from '../doctorHeader/doctorHeader';
import DoctorMain from '../doctorMain/doctorMain';
import { Route, Routes, useParams } from 'react-router-dom';
import React from 'react';

const DoctorPage = () => {
    const { doctorIIN } = useParams();

    return (
        <div className='doctorPage'>
            <DoctorHeader doctorIIN={doctorIIN}/>
            <Routes>
                <Route path={`account/*`} element={<DoctorMain doctorIIN={doctorIIN} openedSection={'account'}/>} />
                <Route path={`patients/*`} element={<DoctorMain doctorIIN={doctorIIN} openedSection={'patients'}/>} />
            </Routes>
        </div>
    );
}

export default DoctorPage;