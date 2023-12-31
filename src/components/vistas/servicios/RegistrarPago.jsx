import React, { useEffect, useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import CheckIcon from '../../../assets/img/check.svg'
import { db } from "../../../firebase";
import { Link, useNavigate } from 'react-router-dom';

import { jsPDF } from 'jspdf';

const RegistrarPago = () => {
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "servicio") {
      const servicioSeleccionado = servicios.find(servicio => servicio.id === value);
      setForm(prevState => ({
        ...prevState,
        servicio: value, // Añade esta línea
        nombre: servicioSeleccionado.nombre,
        costo: servicioSeleccionado ? servicioSeleccionado.costo : ''
      }));
    } else {
      setForm(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  }

  const [form, setForm] = useState({
    edificio: "",
    numeroDepartamento: "",
    servicio: '',
    costo: '',
    fechaHoraPago: '',
    cobro: '',
    encargado: '',
  });

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);

    try {
      const docRef = await addDoc(collection(db, "pagoServicios"), {
        edificio: formData.get("edificio"),
        numeroDepartamento: formData.get("numeroDepartamento"),
        servicio: formData.get("servicio"),
        costo: form.costo,
        fechaHoraPago: fechaHoraPago,
        cobro: formData.get("cobro"),
        encargado: formData.get("encargado"),
      });
      console.log("Document written with ID: ", docRef.id);
      setModalOpen(true);


    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error: no esta conectado!");
    }
    setIsSubmitting(false);
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAcceptClick = () => {
    setModalOpen(false);
    navigate('/servicios');
  }

  //Cargar los servicios

  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      const serviciosCollection = collection(db, "servicios");
      const serviciosSnapshot = await getDocs(serviciosCollection);
      const serviciosList = serviciosSnapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre,
        costo: doc.data().costo,
        cobro: doc.data().cobro,
      }));
      setServicios(serviciosList);
      console.log(serviciosList)
    }

    fetchServicios();
  }, []);


  //Cargar los edificios al dropdown
  const [edificios, setEdificios] = useState([]);

  useEffect(() => {
    const fetchEdificios = async () => {
      const edificiosCollection = collection(db, "edificios");
      const edificiosSnapshot = await getDocs(edificiosCollection);
      const edificiosList = edificiosSnapshot.docs.map(doc => doc.data().nombre_edificio);
      setEdificios(edificiosList);
      console.log(edificiosList)
    }

    fetchEdificios();
  }, []);

  //cargar departamentos
  const [departamentos, setDepartamentos] = useState([]);

  const handleEdificioChange = async (e) => {
    handleChange(e); // Continua actualizando el estado del formulario.

    const selectedEdificio = e.target.value;
    const departamentosCollection = collection(db, "departamentos");
    const departamentosQuery = query(departamentosCollection, where("edificio", "==", selectedEdificio));
    const departamentosSnapshot = await getDocs(departamentosQuery);
    const departamentosList = departamentosSnapshot.docs.map(doc => doc.data().numeroDepartamento);
    setDepartamentos(departamentosList);
  };

  //Fecha Hora
  const [fechaHoraPago, setFechaHoraPago] = useState(getGTMMinus4Date());

  return (
    <>

      {/* <!-- Hire Us --> */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              Registrar Pago
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Ingrese informacion del pago
            </p>
          </div>

          <div className="mt-12">
            {/* <!-- Form --> */}
            <form onSubmit={handleOnSubmit}>
              <div className="grid gap-4 lg:gap-6">
                <div>
                  <label htmlFor="servicio" className="block text-sm text-gray-700 font-medium dark:text-white">Nombre del Servicio</label>
                  <select
                    type="text"
                    name="servicio"
                    id="servicio"

                    value={form.servicio}
                    onChange={handleChange}
                    className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <option value="" disabled={form.nombre !== ""}>Seleccione un servicio...</option>
                    {servicios.map(servicio => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.nombre} - {servicio.cobro}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="edificio" className="block text-sm text-gray-700 font-medium dark:text-white">Edificio</label>
                    <select
                      type="text"
                      name="edificio"

                      id="edificio"
                      value={form.edificio}
                      onChange={handleEdificioChange}
                      className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <option value="" disabled={form.edificio !== ""}>Seleccione un edificio...</option>
                      {edificios.map(edificio => (
                        <option key={edificio} value={edificio}>
                          {edificio}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="numeroDepartamento" className="block text-sm text-gray-700 font-medium dark:text-white">Nro. de departamento</label>
                    <select
                      type="text"
                      name="numeroDepartamento"
                      id="numeroDepartamento"
                      value={form.numeroDepartamento}
                      onChange={handleChange}
                      className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      {departamentos.map(depto => (
                        <option key={depto} value={depto}>
                          {depto}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* <!-- End Grid --> */}

                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="costo" className="block text-sm text-gray-700 font-medium dark:text-white">{'Costo del servicio [Bs.]'}</label>
                    <input type="number" disabled name="costo" id="costo" value={form.costo} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="cobro" className="block text-sm text-gray-700 font-medium dark:text-white">{'Monto cobrado [Bs.]'}</label>
                    <input type="number"
                      required
                      aria-describedby="Complete el campo"
                      name="cobro" id="cobro" value={form.cobro} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />


                  </div>
                </div>
                {/* <!-- End Grid --> */}

                <div>
                  <label htmlFor="fechaHoraPago" className="block text-sm text-gray-700 font-medium dark:text-white">
                    Fecha y hora del Pago
                  </label>
                  <input
                    type="text"
                    disabled
                    name="fechaHoraPago"
                    id="fechaHoraPago"
                    value={fechaHoraPago.toLocaleString()} // Convierte el objeto Date a una cadena legible
                    readOnly
                    className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="encargado" className="block text-sm text-gray-700 font-medium dark:text-white">Encargado del cobro</label>
                  <input type="text"
                    required
                    aria-describedby="Complete el campo"
                    name="encargado" id="encargado" value={form.encargado} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                </div>
              </div>
              {/* <!-- End Grid --> */}




              <div className="mt-6 grid">
                <button type="submit" className="inline-flex justify-center items-center gap-x-3 ${isSubmitting ? 'opacity-20' : 'opacity-100'} text-center bg-blue-600 hover:bg-blue-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800">
                  Registrar
                  {isSubmitting && ( // Si isSubmitting es true, muestra el spinner
                  <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-400 rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                  </button>
                
              </div>

              <div className="mt-3 text-center">
              </div>
            </form>
            {/* <!-- End Form --> */}

            <Link to={'/servicios'}>
              <div className="mt-6 grid">
                <button className="inline-flex justify-center items-center gap-x-3 text-center bg-slate-600 hover:bg-slate-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800">Regresar</button>
              </div>
            </Link>
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
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Registro Satisfactorio</h3>
                <p className="text-sm sm:text-base leading-relaxed text-gray-500">Se registro el edificio</p>

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

export default RegistrarPago