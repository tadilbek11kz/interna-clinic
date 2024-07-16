import { useContext, useEffect } from 'react';
import './patientHeader.scss';
import LogOutIcon from './icons/logoutButtonIcon.png'
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthContext from '../../../auth/authContext';

const PatientHeader = ({ patientIIN }) => {
  let location = useLocation();
  const { setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);

  const logOutButtonHandle = () => {
    const confirmation = window.confirm("Вы уверены, что хотите выйти из аккаунта?");
    if (!confirmation) {
      return;
    }

    setIsAuthenticated(false);
    setRedirectTo('/login');
    localStorage.removeItem('currentUserData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  useEffect(() => {
    if (redirectTo) {
      setRedirectTo(null);
    }
  }, [redirectTo, setRedirectTo]);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="header_box">
      <nav className="navigation_box">
        <ul className='navbar'>
          <Link to={`/patient/${patientIIN}/account`} className={`navbar__element ${location.pathname === `/patient/${patientIIN}/account` ? "active" : ""}`}><li>ЛИЧНЫЙ КАБИНЕТ ПАЦИЕНТА</li></Link>
          <Link to={`/patient/${patientIIN}/tests`} className={`navbar__element ${location.pathname.includes(`/patient/${patientIIN}/tests`) ? "active" : ""}`}><li>ТЕСТЫ</li></Link>
        </ul>
      </nav>
      <img className='logOutButton' src={LogOutIcon} alt='Выйти из аккаунта?' onClick={() => logOutButtonHandle()}></img>
    </div>
  );
}

export default PatientHeader;
