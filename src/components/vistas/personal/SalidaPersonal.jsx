import React, { useEffect, useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import CheckIcon from '../../../assets/img/check.svg'
import { Timestamp } from 'firebase/firestore';

import { db } from "../../../firebase";
import { useNavigate } from 'react-router-dom';

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';


const SalidaPersonal = () => {
  const navigate = useNavigate();
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    if (!form.cargo || !form.nombre) {
      setErrorMessage("Por favor, seleccione tanto el Cargo como el Nombre antes de registrar.");
      return;
    }
  
    // 1. Encuentra el empleado seleccionado en el array 'nombres'.
    const selectedEmpleado = nombres.find(emp => emp.nombreCompleto === form.nombre);
  
    // Si encontramos al empleado seleccionado, realizamos un PUT request a la API de Laravel.
    if (selectedEmpleado) {
      const url = `http://127.0.0.1:8000/api/asistencia-empleados/${selectedEmpleado.id}`;
      
      // Prepara el objeto con la nueva fechaHoraSalida, asegúrate de que esté en el formato correcto.
      const updatedData = {
        fechaHoraSalida: fechaHoraSalida, // por ejemplo, si quieres la fecha y hora actuales
      };
  
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Si necesitas configurar tokens de autenticación u otros encabezados, hazlo aquí.
          },
          body: JSON.stringify(updatedData),
        });
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        // alert("Registro satisfactorio!");
        setModalOpen(true);
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Error: no está conectado o el servidor no responde adecuadamente.");
      }
    } else {
      console.error("No se encontró al empleado seleccionado.");
    }
  };

  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    cargo: '',
    nombre: '',
    fechaHoraIngreso: '',
    fechaHoraSalida: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  //Cargar los cargos al dropdown
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/asistencia-empleados');
        if (!response.ok) throw new Error(response.statusText);
  
        const data = await response.json();
        // Usando un Set para garantizar valores únicos
        const cargosSet = new Set(data.map(item => item.cargo));
  
        // Convertimos el Set a un array y lo establecemos en el estado.
        setCargos([...cargosSet]);
      } catch (error) {
        console.error('Error al cargar los cargos:', error);
      }
    };
  
    fetchCargos();
  }, []);

  //Ver la fecha y hora
  const [fechaHoraSalida, setFechaHoraSalida] = useState(formatDateToDDMMAAHHMM(getGTMMinus4Date()));


  const [nombres, setNombres] = useState([]);

  const handleCargoChange = async (e) => {
    handleChange(e); // Continua actualizando el estado del formulario.
  
    const selectedCargo = e.target.value;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/asistencia-empleados');
      if (!response.ok) throw new Error(response.statusText);
  
      const data = await response.json();
      // Filtramos los empleados por el cargo seleccionado y que no tienen fechaHoraSalida
      const nombresList = data
        .filter(item => item.cargo === selectedCargo && item.fechaHoraSalida === '-')
        .map(item => ({
          nombreCompleto: item.nombre,
          fechaHoraIngreso: item.fechaHoraIngreso,
          id: item.id
        }));
  
      setNombres(nombresList);
    } catch (error) {
      console.error('Error al cargar los nombres:', error);
    }
  };
  
  const handleNombreChange = (e) => {
    handleChange(e);
  
    // Busca el empleado seleccionado por su nombre en nombresList
    const selectedEmpleado = nombres.find(emp => emp.nombreCompleto === e.target.value);
    if (selectedEmpleado) {
      // Asumiendo que deseas mantener el formato de fecha como está en la respuesta
      setForm(prev => ({
        ...prev,
        fechaHoraIngreso: selectedEmpleado.fechaHoraIngreso,
      }));
    } else {
      console.error("No se encontró al empleado seleccionado."); 
    }
  };

  //mostrar un modal para el ingreso e imprimir ticket

  const [isModalOpen, setModalOpen] = useState(false);

  const handleAcceptClick = () => {
    setModalOpen(false);
    navigate('/personal');
  }
  //Convertir la fecha para mostrarla
  function firestoreDateToFormattedDate(firestoreTimestamp) {
    const date = firestoreTimestamp.toDate(); // Convertimos el Timestamp de Firestore a un Date

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  }

  return (
    <>

      {/* <!-- Hire Us --> */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              Salida del Personal
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Registrar salida del personal
            </p>
          </div>

          <div className="mt-12">
            {/* <!-- Form --> */}
            <form onSubmit={handleOnSubmit}>
              <div className="grid gap-4 lg:gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="cargo" className="block text-sm text-gray-700 font-medium dark:text-white">Cargo</label>
                    <select
                      type="text"
                      name="cargo"
                      id="cargo"
                      value={form.cargo}
                      onChange={handleCargoChange}
                      className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <option value="" disabled={form.cargo !== ""}>Seleccione un Cargo...</option>
                      {cargos.map(cargo => (
                        <option key={cargo} value={cargo}>
                          {cargo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="nombre" className="block text-sm text-gray-700 font-medium dark:text-white">Nombre</label>
                  <select
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={form.nombre}
                    onChange={handleNombreChange}
                    className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <option value="" disabled={form.nombre !== ""}>Seleccione un Nombre...</option>
                    {nombres.map(({ nombreCompleto }) => (
                      <option key={nombreCompleto} value={nombreCompleto}>
                        {nombreCompleto}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="fechaHoraIngreso" className="block text-sm text-gray-700 font-medium dark:text-white">
                      Fecha y hora de Ingreso
                    </label>
                    <input
                      type="text"
                      name="fechaHoraIngreso"
                      id="fechaHoraIngreso"
                      value={form.fechaHoraIngreso} // Convierte el objeto Date a una cadena legible
                      readOnly
                      className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="fechaHoraSalida" className="block text-sm text-gray-700 font-medium dark:text-white">
                      Fecha y hora de Salida
                    </label>
                    <input
                      type="text"
                      name="fechaHoraSalida"
                      id="fechaHoraSalida"
                      value={fechaHoraSalida.toLocaleString()} // Convierte el objeto Date a una cadena legible
                      readOnly
                      className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    />
                  </div>
                </div>

              </div>
              {/* <!-- End Grid --> */}



              {errorMessage && <p className="text-xs text-red-600 mt-2">{errorMessage}</p>}

              <div className="mt-6 grid">
                <button type="submit" className="inline-flex justify-center items-center gap-x-3 text-center bg-blue-600 hover:bg-blue-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800">Registrar Salida</button>
              </div>

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


      {/* <!-- End Hire Us --> */}
      <Footer />
    </>
  )
}

function generateIdIngreso(date) {
  let hours = String(date.getHours()).padStart(2, '0');
  let minutes = String(date.getMinutes()).padStart(2, '0');
  let seconds = String(date.getSeconds()).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque los meses en JavaScript son 0-indexed

  return `${hours}${minutes}${seconds}${day}${month}`;
}

function getGTMMinus4Date() {
  const now = new Date(); // Obtiene la fecha/hora actual
  const timezoneOffset = now.getTimezoneOffset(); // Obtiene la diferencia en minutos con respecto a GMT
  const desiredOffset = 4 * 60; // El desfase que deseas (4 horas para GMT-4)

  // Ajustamos la fecha/hora actual a GMT-4
  now.setMinutes(now.getMinutes() + timezoneOffset - desiredOffset);

  return now; // Retorna el objeto Date
}

// Función para formatear la fecha en el formato "DD/MM/AA HH:MM"
function formatDateToDDMMAAHHMM(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses van de 0 a 11
  const year = date.getFullYear().toString().substr(-2); // Solo los últimos dos dígitos
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default SalidaPersonal