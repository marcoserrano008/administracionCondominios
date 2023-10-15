import React, { useEffect, useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import { collection, addDoc, getDocs } from "firebase/firestore";

import { db } from "../../../firebase";
import { useNavigate } from 'react-router-dom';

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';


const Ingresos = () => {

  const navigate = useNavigate();
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const docRef = await addDoc(collection(db, "ingresos"), {
        edificio: formData.get("edificio"),
        numeroDepartamento: formData.get("numeroDepartamento"),
        tipoVisitante: formData.get("tipoVisitante"),
        motivoVisita: formData.get("motivoVisita"),
        nombreCompleto: formData.get("nombreCompleto"),
        ci: formData.get("ci"),
        placaVehiculo: formData.get("placaVehiculo"),
        fechaHoraIngreso: fechaHoraIngreso,
        registroSalida: 'no',
        tiempoMinutos: 0,
        idIngreso: generateIdIngreso(fechaHoraIngreso),
      });
      console.log("Document written with ID: ", docRef.id);
      console.log(docRef.idIngreso)
      setIdTicket(generateIdIngreso(fechaHoraIngreso))
      // alert("Registro satisfactorio!");
      
      setShowModal(true);


    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error: no esta conectado!");
    }
  };

  const [form, setForm] = useState({
    edificio: "",
    numeroDepartamento: "",
    tipoVisitante: "",
    motivoVisita: "",
    nombreCompleto: "",
    ci: "",
    placaVehiculo: "",
    fechaHoraIngreso: "",
    registroSalida: "",
    tiempoMinutos: "",
    idIngreso: "",

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  //Cargar los edificios al dropdown
  const [edificios, setEdificios] = useState([]);


  //Ver la fecha y hora
  const [fechaHoraIngreso, setFechaHoraIngreso] = useState(getGTMMinus4Date());


  //cargar edficios y departamentos
  const [departamentos, setDepartamentos] = useState([]);
  const [todosLosDepartamentos, setTodosLosDepartamentos] = useState([]);
  useEffect(() => {
    const fetchEdificiosYDepartamentos = async () => {
      // Obtener Edificios

      const edificiosCollection = collection(db, "edificios");
      const edificiosSnapshot = await getDocs(edificiosCollection);
      const edificiosList = edificiosSnapshot.docs.map(doc => doc.data().nombre_edificio);
      setEdificios(edificiosList);

      // Obtener Todos los Departamentos
      const departamentosCollection = collection(db, "departamentos");
      const departamentosSnapshot = await getDocs(departamentosCollection);
      setTodosLosDepartamentos(departamentosSnapshot.docs.map(doc => doc.data()));
      setDepartamentos(departamentosSnapshot.docs.map(doc => doc.data().numeroDepartamento));
    }

    fetchEdificiosYDepartamentos();
  }, []);

  //Manejar el cambio de edificio
  const handleEdificioChange = (e) => {
    handleChange(e); // Continua actualizando el estado del formulario.

    const selectedEdificio = e.target.value;
    const departamentosDelEdificio = todosLosDepartamentos.filter(depto => depto.edificio === selectedEdificio);
    setDepartamentos(departamentosDelEdificio.map(depto => depto.numeroDepartamento));
  };


  //mostrar un modal para el ingreso e imprimir ticket
  const [idTicket, setIdTicket] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const downloadQRCodePDF = async (idIngreso) => {
    const doc = new jsPDF();
    const qrDataURL = await QRCode.toDataURL(idIngreso);
    doc.addImage(qrDataURL, 'PNG', 15, 40, 180, 180);
    doc.text(idIngreso, 85, 230);
    doc.save(`Ticket-${idIngreso}.pdf`);
  }

  const handleAcceptClick = () => {
    setShowModal(false);
    navigate('/visitas');
}


  return (
    <>
      <Header />

      {/* <!-- Hire Us --> */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              Registrar Ingreso
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Ingrese la informacion de la visita
            </p>
          </div>

          <div className="mt-12">
            {/* <!-- Form --> */}
            <form onSubmit={handleOnSubmit}>
              <div className="grid gap-4 lg:gap-6">
                {/* <div>
                  <label htmlFor="edificio" className="block text-sm text-gray-700 font-medium dark:text-white">Edificio</label>
                  <input type="text" name="edificio" id="edificio" value={form.edificio} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                </div> */}

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
                    {edificios.map(edificio => (
                      <option key={edificio} value={edificio}>
                        {edificio}
                      </option>
                    ))}
                  </select>
                </div>


                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">

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


                  <div>
                    <label htmlFor="tipoVisitante" className="block text-sm text-gray-700 font-medium dark:text-white">Tipo de Visitante</label>
                    <select name="tipoVisitante" id="tipoVisitante" value={form.estado} onChange={handleChange} className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                      <option selected>Residente</option>
                      <option>Visitante Familiar</option>
                      <option>Visitante Amigo</option>
                      <option>Repartidor</option>
                      <option>Técnico o Mantenimiento</option>
                      <option>Empleado Doméstico</option>
                      <option>Agente Inmobiliario</option>
                      <option>Proveedor de Servicio</option>
                      <option>Oficial o Autoridad</option>
                      <option>Prospecto o Interesado</option>
                      <option>Contratista</option>
                      <option>Emergencia Médica</option>
                      <option>Administrativo</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>



                {/* <!-- End Grid --> */}

                <div>
                  <label htmlFor="motivoVisita" className="block text-sm text-gray-700 font-medium dark:text-white">Motivo de la visita</label>
                  <select name="motivoVisita" id="motivoVisita" value={form.estado} onChange={handleChange} className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                    <option selected>Visita Social</option>
                    <option>Entrega o paquetería</option>
                    <option>Mantenimiento o reparación</option>
                    <option>Venta o prospección</option>
                    <option>Reunión de negocios o trabajo</option>
                    <option>Inspección o evaluación</option>
                    <option>Mudanza</option>
                    <option>Cuidado de niños o adultos</option>
                    <option>Tutoría o clases</option>
                    <option>Servicio doméstico</option>
                    <option>Emergencia médica</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="nombreCompleto" className="block text-sm text-gray-700 font-medium dark:text-white">Nombre Completo</label>
                  <input type="text" name="nombreCompleto" id="nombreCompleto" value={form.direccion} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                </div>
                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="ci" className="block text-sm text-gray-700 font-medium dark:text-white">CI</label>
                    <input type="number" name="ci" id="ci" value={form.celular} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="placaVehiculo" className="block text-sm text-gray-700 font-medium dark:text-white">Placa Vehiculo</label>
                    <input type="number" name="placaVehiculo" id="placaVehiculo" value={form.telefono} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}

                <div>
                  <label htmlFor="fechaHoraIngreso" className="block text-sm text-gray-700 font-medium dark:text-white">
                    Fecha y hora de Ingreso
                  </label>
                  <input
                    type="text"
                    name="fechaHoraIngreso"
                    id="fechaHoraIngreso"
                    value={fechaHoraIngreso.toLocaleString()} // Convierte el objeto Date a una cadena legible
                    readOnly
                    className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  />
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

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Ingreso registrado con éxito</h4>
            <p>ID de Ingreso: {idTicket}</p>
            <button onClick={handleAcceptClick}>Aceptar</button>
            <button onClick={() => downloadQRCodePDF(idTicket)}>Imprimir Ticket</button>
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

export default Ingresos