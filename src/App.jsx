import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import SignUp from './components/login/SignUp';
import Dashboard from './components/login/Dashboard';
import PrivateRoute from './components/login/PrivateRoute';
import { AuthProvider } from './auth/AuthContext';
import Landing from './components/vistas/Landing';
import Landing2 from './components/vistas/Landing2';
import Servicios from './components/vistas/Servicios';
import Condominio from './components/vistas/Condominio';
import Personal from './components/vistas/Personal';
import Visitas from './components/vistas/Visitas';
import Anuncios from './components/vistas/Anuncios';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path='/servicios' element={<Servicios />} />
          <Route path='/condominio' element={<Condominio />} />
          <Route path='/personal' element={<Personal/>} />
          <Route path='/visitas' element={<Visitas/>} />
          <Route path='/anuncios' element={<Anuncios/>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
