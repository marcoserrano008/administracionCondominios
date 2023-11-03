import React, { useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'

import { db } from "../../../firebase";
import { useNavigate } from 'react-router-dom';

import CheckIcon from '../../../assets/img/check.svg'

import { collection, doc, getDoc, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";


const Salidas = () => {

  const [form, setForm] = useState({
    idIngreso: '',
    edificio: "",          // Añade este
    numeroDepartamento: "",// Asegúrate de tener esto
    fechaHoraIngreso: "",  // Añade este
    fechaHoraSalida: "",   // Añade este
    nombreCompleto: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };



  //Verificar los datos
  const handleVerification = async () => {
    try {
      // Realiza la solicitud GET a la API de Laravel para obtener todos los ingresos.
      const apiUrl = `http://127.0.0.1:8000/api/ingresos`;
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Extrae el JSON de la respuesta.
      const ingresos = await response.json();
  
      // Encuentra el ingreso que coincide con el 'idIngreso' proporcionado en el formulario.
      const ingresoEncontrado = ingresos.find(ing => ing.idIngreso === form.idIngreso);
  
      if (ingresoEncontrado) {
        setIsVerified(true);
  
        console.log(ingresoEncontrado.id); // El ID del registro en Laravel.
        setDocId(ingresoEncontrado.id); // Guarda el ID del registro de Laravel.
  
        setForm({
          ...form,
          edificio: ingresoEncontrado.edificio,
          nombreCompleto: ingresoEncontrado.nombreCompleto,
          numeroDepartamento: ingresoEncontrado.numeroDepartamento,
          fechaHoraIngreso: ingresoEncontrado.fechaHoraIngreso // La fecha ya está en formato de cadena.
          // Añade más campos aquí si lo necesitas.
        });
      } else {
        console.log("No such document!");
        alert("El código de ingreso no existe.");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  //agregar salida: si
  const [docId, setDocId] = useState(null);

  const handleOnSubmit = async (event) => {
    event.preventDefault();
  
    if (!docId) {
      alert("Primero verifica el Código de Ingreso.");
      return;
    }
  
    // Construye el objeto de datos que se enviará en la solicitud PUT.
    const dataToUpdate = {
      registroSalida: "Sí",
      fechaHoraSalida: fechaHoraSalida, // Asegúrate de que esta variable tiene el valor correcto.
    };
  
    try {
      const apiUrl = `http://127.0.0.1:8000/api/ingresos/${docId}`;
      const response = await fetch(apiUrl, {
        method: 'PUT', // Método HTTP de solicitud PUT.
        headers: {
          'Content-Type': 'application/json',
          // Incluir otros encabezados si es necesario, como tokens de autenticación.
        },
        body: JSON.stringify(dataToUpdate), // Convierte los datos a una cadena JSON.
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Aquí puedes manejar la respuesta de la solicitud PUT.
      const result = await response.json();
      console.log(result); // Ver la respuesta del servidor.
      
      setModalOpen(true); // Abre el modal si todo va bien.
  
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  //Deshabilitar el boton de registrar
  const [isVerified, setIsVerified] = useState(false);

  const [fechaHoraSalida, setFechaHoraIngreso] = useState(getGTMMinus4Date());

  //Acciones para el modal
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const handleAcceptClick = () => {
    setModalOpen(false);
    navigate('/visitas');
  }


  return (
    <>

      {/* <!-- Hire Us --> */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              Registrar Salida
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Ingrese su informacion
            </p>
          </div>

          <div className="mt-12">
            {/* <!-- Form --> */}
            <form onSubmit={handleOnSubmit}>
              <div className="grid gap-4 lg:gap-6">
                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="idIngreso" className="block text-sm text-gray-700 font-medium dark:text-white">Codigo de Ingreso</label>
                    <input type="text" name="idIngreso" id="idIngreso" onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div className='mt-4'>
                    <button type="button" onClick={handleVerification} className="inline-flex justify-center items-center gap-x-3 text-center bg-blue-600 hover:bg-blue-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800">Verificar</button>
                  </div>
                </div>
                {/* <!-- End Grid --> */}


                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="edificio" className="block text-sm text-gray-700 font-medium dark:text-white">Edificio</label>
                    <input type="text" name="edificio" id="edificio" disabled value={form.edificio} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="numeroDepartamento" className="block text-sm text-gray-700 font-medium dark:text-white">Departamento</label>
                    <input type="text" name="numeroDepartamento" disabled id="numeroDepartamento" value={form.numeroDepartamento} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}
                <div>
                  <label htmlFor="nombreCompleto" className="block text-sm text-gray-700 font-medium dark:text-white">Nombre Completo</label>
                  <input type="text" name="nombreCompleto" disabled id="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                </div>

                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="fechaHoraIngreso" className="block text-sm text-gray-700 font-medium dark:text-white">Fecha y hora de ingreso</label>
                    <input type="text" name="fechaHoraIngreso" disabled id="fechaHoraIngreso" value={form.fechaHoraIngreso} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="fechaHoraSalida" className="block text-sm text-gray-700 font-medium dark:text-white">Fecha y hora de salida</label>
                    <input type="text" name="fechaHoraSalida" disabled id="fechaHoraSalida" 
                    value={fechaHoraSalida.toLocaleString()} // Convierte el objeto Date a una cadena legible
                    readOnly
                    onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}

              </div>
              {/* <!-- End Grid --> */}




              <div className="mt-6 grid">
                <button
                  type="submit"
                  disabled={!isVerified}
                  className={`inline-flex justify-center items-center gap-x-3 text-center ${isVerified ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800`}>
                  Registrar Salida
                </button>              </div>

              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500">
                  Los datos seran guardados
                </p>
              </div>
            </form>
            {/* <!-- End Form --> */}
          </div>
        </div>
      </div>
      {/* <!-- End Hire Us --> */}

      {isModalOpen && (
        <div className="flex justify-center items-center hs-overlay w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto bg-black bg-opacity-20">
          <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 opacity-100 hs-overlay-open:duration-500 mt-0 ease-out transition-all sm:max-w-lg sm:w-full">
            <div className="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-gray-800">
              <div className="absolute top-2 right-2">
                {/* <button
                  type="button"
                  className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                  onClick={toggleModal}
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor"/>
                  </svg>
                </button> */}
              </div>
              <div className="p-4 sm:p-10 text-center overflow-y-auto">
                {/* Icon */}
                <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] ">
                  <img src={CheckIcon} className="w-25 h-25" alt="Check Icon" />
                </span>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Salida registrada con éxito</h3>
                <p className="text-sm sm:text-base leading-relaxed text-gray-500">Presione aceptar</p>

                {/* Buttons */}
                <div className="mt-8 flex justify-center items-center space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                    onClick={handleAcceptClick}
                  >
                    Aceptar
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

function getGTMMinus4Date() {
  const now = new Date(); // Obtiene la fecha/hora actual
  const timezoneOffset = now.getTimezoneOffset(); // Obtiene la diferencia en minutos con respecto a GMT
  const desiredOffset = 4 * 60; // El desfase que deseas (4 horas para GMT-4)

  // Ajustamos la fecha/hora actual a GMT-4
  now.setMinutes(now.getMinutes() + timezoneOffset - desiredOffset);

  return now; // Retorna el objeto Date
}

export default Salidas