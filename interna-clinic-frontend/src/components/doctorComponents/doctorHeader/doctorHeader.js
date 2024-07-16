import './doctorHeader.scss';
import { Link, Navigate, useLocation } from "react-router-dom";
import LogOutIcon from './icons/logoutButtonIcon.png'
import { useContext, useEffect } from 'react';
import AuthContext from '../../../auth/authContext';
import PageContext from '../../../contexts/pageContext';

const DoctorHeader = ({doctorIIN}) => {
  let location = useLocation();
  const { setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
  const { currentPage, handlePageChange } = useContext(PageContext); 
    
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
              <Link to={`/doctor/${doctorIIN}/account`} className={`navbar__element ${location.pathname === `/doctor/${doctorIIN}/account` ? "active" : ""}`} onClick={() => {handlePageChange(1)}}><li>ЛИЧНЫЙ КАБИНЕТ ВРАЧА</li></Link>
              <Link to={`/doctor/${doctorIIN}/patients`} className={`navbar__element ${location.pathname === `/doctor/${doctorIIN}/patients` ? "active" : ""}`} onClick={() => {handlePageChange(1)}}><li>ПАЦИЕНТЫ</li></Link>
            </ul>
        </nav>
        <img className='logOutButton' src={LogOutIcon} alt='Выйти из аккаунта?' onClick={() => logOutButtonHandle()}></img>
      </div>
  );
}
  
  export default DoctorHeader;
