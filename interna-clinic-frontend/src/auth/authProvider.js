import React from 'react';
import AuthContext from './authContext';

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('accessToken'));
  const [redirectTo, setRedirectTo] = React.useState(null);

  async function login(login, password, role) {
    const response = await fetch('http://hepatest.kz/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: login,
        password: password,
        scope: role,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error logging in. Status code: ${response.status}`);
    }

    setIsAuthenticated(true);

    const data = await response.json();
    const { access_token, refresh_token } = data;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);

    const userData = { 'login': login, 'role': role };
    localStorage.setItem('currentUserData', JSON.stringify(userData));

    if (role === "Patient") {
      setRedirectTo(`/patient/${login}/account`);
    } else if (role === "Doctor") {
      setRedirectTo(`/doctor/${login}/account`);
    } else if (role === "Admin") {
      setRedirectTo(`/admin/${login}/all_patients`);
    }

    return response;
  }

  async function refresh() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      setIsAuthenticated(false);
      setRedirectTo('/login');
    }

    const response = await fetch('http://hepatest.kz/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + refreshToken
      },
    });

    if (!response.ok) {
      setIsAuthenticated(false);
      setRedirectTo('/login');
      throw new Error(`Error occured while refreshing token. Status code: ${response.status}`);
    }

    const data = await response.json();
    const { access_token, refresh_token } = data;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);

    return response;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, refresh, redirectTo, setRedirectTo }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
