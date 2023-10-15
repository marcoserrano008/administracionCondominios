import React, { useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import { collection, addDoc } from "firebase/firestore";

import { db } from "../../../firebase";
import { useNavigate } from 'react-router-dom';

const NuevoPersonal = () => {
  const navigate = useNavigate();
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const docRef = await addDoc(collection(db, "personal"), {
        nombre:form.nombre,
        apellidoPaterno:form.apellidoPaterno,
        apellidoMaterno:form.apellidoMaterno,
        genero:form.genero,
        ci:form.ci,
        fechaNacimiento:form.fechaNacimiento,
        direccion:form.direccion,
        correo:form.correo,
        contacto:form.contacto,
        nombreEmergencia:form.nombreEmergencia,
        contactoEmergencia:form.contactoEmergencia,
        cargo:form.cargo,
        fechaInicio:form.fechaInicio,
        horaIngreso:form.horaIngreso,
        horaSalida:form.horaSalida,
        salario:form.salario,
        diasSemana:form.diasSemana,

      });
      console.log("Document written with ID: ", docRef.id);
      alert("Registro satisfactorio!");
      navigate('/personal');

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error: no esta conectado!");
    }
  };

  const [form, setForm] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    genero: '',
    ci: '',
    fechaNacimiento: '',
    direccion: '',
    correo: '',
    contacto: '',
    nombreEmergencia: '',
    contactoEmergencia: '',
    cargo: '',
    fechaInicio: '',
    horaIngreso: '',
    horaSalida: '',
    salario: '',
    diasSemana: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <>
      <Header />

      {/* <!-- Hire Us --> */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              Registrar Personal
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Ingrese su informacion
            </p>
          </div>
          <div className="mt-12">
            {/* <!-- Form --> */}
            <form onSubmit={handleOnSubmit}>
              <div className="grid gap-4 lg:gap-6">

              <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">Informacion Personal</div>
         
                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm text-gray-700 font-medium dark:text-white">{'Nombre(s)'}</label>
                    <input type="text" name="nombre" id="nombre" value={form.nombre} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="apellidoPaterno" className="block text-sm text-gray-700 font-medium dark:text-white">Apellido Paterno</label>
                    <input type="text" name="apellidoPaterno" id="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="apellidoMaterno" className="block text-sm text-gray-700 font-medium dark:text-white">Apellido Materno</label>
                    <input type="text" name="apellidoMaterno" id="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                </div>
                {/* <!-- End Grid --> */}


                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="genero" className="block text-sm text-gray-700 font-medium dark:text-white">Genero</label>                    
                    <select name="genero" id="genero" value={form.genero} onChange={handleChange} className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                      <option value='' disabled>Seleccionar...</option>
                      <option>Masculino</option>
                      <option>Femenino</option>
                      <option>Prefiero no especificar</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ci" className="block text-sm text-gray-700 font-medium dark:text-white">CI</label>
                    <input type="text" name="ci" id="ci" value={form.ci} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="fechaNacimiento" className="block text-sm text-gray-700 font-medium dark:text-white">Fecha de Nacimiento</label>
                    <input type="date" name="fechaNacimiento" id="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                </div>
                {/* <!-- End Grid --> */}

                <div>
                  <label htmlFor="direccion" className="block text-sm text-gray-700 font-medium dark:text-white">Direccion</label>
                  <input type="text" name="direccion" id="direccion" value={form.direccion} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                </div>
                <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">Informacion de contacto</div>

                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  <div className='col-span-2'>
                    <label htmlFor="correo" className="block text-sm text-gray-700 font-medium dark:text-white">Correo Electronico</label>
                    <input type="email" name="correo" id="correo" value={form.correo} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="contacto" className="block text-sm text-gray-700 font-medium dark:text-white">Numero de contacto</label>
                    <input type="number" name="contacto" id="contacto" value={form.contacto} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                </div>
                {/* <!-- End Grid --> */}

                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  <div className='col-span-2'>
                    <label htmlFor="nombreEmergencia" className="block text-sm text-gray-700 font-medium dark:text-white">Nombre contacto de Emergencia:</label>
                    <input type="text" name="nombreEmergencia" id="nombreEmergencia" value={form.nombreEmergencia} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="contactoEmergencia" className="block text-sm text-gray-700 font-medium dark:text-white">Numero Emergencia:</label>
                    <input type="number" name="contactoEmergencia" id="contactoEmergencia" value={form.contactoEmergencia} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                </div>
                {/* <!-- End Grid --> */}

                <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">Informacion Laboral</div>

                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="cargo" className="block text-sm text-gray-700 font-medium dark:text-white">Cargo</label>
                    <select name="cargo" id="cargo" value={form.cargo} onChange={handleChange} className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                      <option value='' disabled>Seleccionar...</option>
                      <option>Administrador</option>
                      <option>Subadministrador</option>
                      <option>Conserje/Portero</option>
                      <option>Vigilante/Seguridad</option>
                      <option>Mantenimiento</option>
                      <option>Jardinero</option>
                      <option>Limpieza</option>
                      <option>Recepcionista</option>
                      <option>Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="fechaInicio" className="block text-sm text-gray-700 font-medium dark:text-white">Fecha Inicio</label>
                    <input type="date" name="fechaInicio" id="fechaInicio" value={form.fechaInicio} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="salario" className="block text-sm text-gray-700 font-medium dark:text-white">{'Salario [Bs.]'}</label>
                    <input type="number" name="salario" id="salario" value={form.salario} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                </div>
                {/* <!-- End Grid --> */}


                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="horaIngreso" className="block text-sm text-gray-700 font-medium dark:text-white">Hora de Ingreso:</label>
                    <input type="time" name="horaIngreso" id="horaIngreso" value={form.horaIngreso} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="horaSalida" className="block text-sm text-gray-700 font-medium dark:text-white">Hora de Salida:</label>
                    <input type="time" name="horaSalida" id="horaSalida" value={form.horaSalida} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="diasSemana" className="block text-sm text-gray-700 font-medium dark:text-white">Dias por semana</label>
                    <input type="text" name="diasSemana" id="diasSemana" value={form.diasSemana} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}
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


export default NuevoPersonal