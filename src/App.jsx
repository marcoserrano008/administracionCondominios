import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import SignUp from './components/login/SignUp';
import Dashboard from './components/login/Dashboard';
import PrivateRoute from './components/login/PrivateRoute';

import Landing from './components/vistas/Landing';
import Landing2 from './components/vistas/Landing2';
import Servicios from './components/vistas/Servicios';
import Condominio from './components/vistas/Condominio';
import Personal from './components/vistas/Personal';
import Visitas from './components/vistas/Visitas';
import Anuncios from './components/vistas/Anuncios';


import Alquiler from './components/vistas/anuncios/Alquiler'
import Anticretico from './components/vistas/anuncios/Anticretico'
import Venta from './components/vistas/anuncios/Venta'

import PropietariosCasas from './components/vistas/condominio/PropietariosCasas'
import PropietariosDepartamentos from './components/vistas/condominio/PropietariosDepartamentos'
import RegistrarCasa from './components/vistas/condominio/RegistrarCasa'
import RegistrarDepartamento from './components/vistas/condominio/RegistrarDepartamento'
import RegistrarEdificio from './components/vistas/condominio/RegistrarEdificio'
import VerCasas from './components/vistas/condominio/VerCasas'
import VerDepartamentos from './components/vistas/condominio/VerDepartamentos'
import VerEdificios from './components/vistas/condominio/VerEdificios'

import IngresoPersonal from './components/vistas/personal/IngresoPersonal'
import ListaPersonal from './components/vistas/personal/ListaPersonal'
import NuevoPersonal from './components/vistas/personal/NuevoPersonal'
import ReporteIngresoSalida from './components/vistas/personal/ReporteIngresoSalida'
import ReportePersonal from './components/vistas/personal/ReportePersonal'
import SalidaPersonal from './components/vistas/personal/SalidaPersonal'

import OrotrgarServicio from './components/vistas/servicios/OtorgarServicio'
import RegistrarPago from './components/vistas/servicios/RegistrarPago'
import ServiciosDisponibles from './components/vistas/servicios/ServiciosDisponibles'

import Ingresos from './components/vistas/visitas/Ingresos'
import Salidas from './components/vistas/visitas/Salidas'
import Vigilantes from './components/vistas/visitas/Vigilantes'
import OtorgarServicio from './components/vistas/servicios/OtorgarServicio';
import RegistrarServicio from './components/vistas/servicios/RegistrarServicio';
import RegistrarResidente from './components/vistas/condominio/RegistrarResidente';
import GestorAnuncios from './components/vistas/anuncios/GestorAnuncios';

import { AuthProvider } from './auth/AuthContext';
import VerPagos from './components/vistas/servicios/VerPagos';
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
            <Route path='/personal' element={<Personal />} />
            <Route path='/visitas' element={<Visitas />} />
            <Route path='/anuncios' element={<Anuncios />} />
            <Route path='/alquiler' element={<Alquiler />} />
            <Route path='/anticretico' element={<Anticretico />} />
            <Route path='/venta' element={<Venta />} />
            <Route path='/propietariosCasas' element={<PropietariosCasas />} />
            <Route path='/propietariosDepartamentos' element={<PropietariosDepartamentos />} />
            <Route path='/registrarCasa' element={<RegistrarCasa />} />
            <Route path='/registrarDepartamento' element={<RegistrarDepartamento />} />
            <Route path='/registrarEdificio' element={<RegistrarEdificio />} />
            <Route path='/verCasas' element={<VerCasas />} />
            <Route path='/verDepartamentos' element={<VerDepartamentos />} />
            <Route path='/verEdificios' element={<VerEdificios />} />
            <Route path='/ingresoPersonal' element={<IngresoPersonal />} />
            <Route path='/listaPersonal' element={<ListaPersonal />} />
            <Route path='/nuevoPersonal' element={<NuevoPersonal />} />
            <Route path='/reporteIngresoSalida' element={<ReporteIngresoSalida />} />
            <Route path='/reportePersonal' element={<ReportePersonal />} />
            <Route path='/salidaPersonal' element={<SalidaPersonal />} />
            <Route path='/otorgarServicio' element={<OtorgarServicio />} />
            <Route path='/registrarPago' element={<RegistrarPago />} />
            <Route path='/serviciosDisponibles' element={<ServiciosDisponibles />} />
            <Route path='/ingresos' element={<Ingresos />} />
            <Route path='/salidas' element={<Salidas />} />
            <Route path='/vigilantes' element={<Vigilantes />} />
            <Route path='/registrarServicio' element={<RegistrarServicio />} />
            <Route path='/registrarPropietario' element={<RegistrarResidente />} />
            <Route path='/gestorAnuncios' element={<GestorAnuncios />} />
            <Route path='/verPagos' element={<VerPagos/>} />
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    
  );
}

export default App;
