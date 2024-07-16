import './adminPage.scss';
import AdminHeader from '../adminHeader/adminHeader';
import AdminMain from '../adminMain/adminMain';
import { Route, Routes, useParams } from 'react-router-dom';
import React from 'react';

const AdminPage = () => {
    const { adminUsername } = useParams();

    return (
        <div className='adminPage'>
            <AdminHeader adminUsername={adminUsername}/>
            <Routes>
                <Route path={`all_patients/*`} element={<AdminMain adminUsername={adminUsername} openedSection={'all_patients'}/>} />
                <Route path={`all_doctors/*`} element={<AdminMain adminUsername={adminUsername} openedSection={'all_doctors'}/>} />
                <Route path={`all_admins/*`} element={<AdminMain adminUsername={adminUsername} openedSection={'all_admins'}/>} />
            </Routes>
        </div>
    );
}

export default AdminPage;
