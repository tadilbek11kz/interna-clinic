import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from "../login/loginPage";
import PatientPage from "../patientComponents/patientPage/patientPage";
import DoctorPage from "../doctorComponents/doctorPage/doctorPage";
import AdminPage from "../adminComponents/adminPage/adminPage";
import AuthProvider from "../../auth/authProvider";
import './app.scss';
import PageProvider from "../../providers/pageProvider";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <PageProvider>
            <Routes>
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/patient/:patientIIN/*" element={<PatientPage/>} />
              <Route path="/doctor/:doctorIIN/*" element={<DoctorPage/>} />
              <Route path="/admin/:adminUsername/*" element={<AdminPage/>} />
              <Route path="*" element={<Navigate to="/login"/>} />
            </Routes>
          </PageProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
