import React, { useEffect, useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

import { db } from "../../../firebase";
import { useNavigate } from 'react-router-dom';

import { jsPDF } from 'jspdf';

const RegistrarPago = () => {
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
  
    if (name === "servicio") {
      const servicioSeleccionado = servicios.find(servicio => servicio.id === value);
      setForm(prevState => ({
        ...prevState,
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
    cobro:'',
    encargado:'',
  });

  const handleOnSubmit = async (event) => {
    event.preventDefault();
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
      alert("Registro satisfactorio!");
      navigate('/servicios');

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error: no esta conectado!");
    }
  };

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
      <Header />

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
                    value={form.nombre}
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
                    <input type="number" name="cobro" id="cobro" value={form.cobro} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />


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
                  <input type="text" name="encargado" id="encargado" value={form.encargado} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                </div>
              </div>
              {/* <!-- End Grid --> */}




              <div className="mt-6 grid">
                <button type="submit" className="inline-flex justify-center items-center gap-x-3 text-center bg-blue-600 hover:bg-blue-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800">Registrar</button>
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
      {/* <!-- End Hire Us --> */}
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