import React, { useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import { collection, addDoc } from "firebase/firestore";

import { db } from "../../../firebase";
import { useNavigate } from 'react-router-dom';

const RegistrarServicio = () => {
  const navigate = useNavigate();
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const docRef = await addDoc(collection(db, "servicios"), {
        nombre: formData.get("nombre"),
        costo: formData.get("costo"),
        cobro: formData.get("cobro"),
        contacto: formData.get("contacto"),
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

  const [form, setForm] = useState({
    nombre_edificio: "",
    cantidad_pisos: "",
    direccion: "",
    celular: "",
    telefono: "",
    correo: ""
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
              Registrar Servicio
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Ingrese informacion del servicio
            </p>
          </div>

          <div className="mt-12">
            {/* <!-- Form --> */}
            <form onSubmit={handleOnSubmit}>
              <div className="grid gap-4 lg:gap-6">

                <div>
                  <label htmlFor="nombre" className="block text-sm text-gray-700 font-medium dark:text-white">Nombre del Servicio</label>
                  <input type="text" name="nombre" id="nombre" value={form.nombre} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                </div>
                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="costo" className="block text-sm text-gray-700 font-medium dark:text-white">Costo</label>
                    <input type="number" name="costo" id="costo" value={form.costo} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="cobro" className="block text-sm text-gray-700 font-medium dark:text-white">Frecuencia de cobro</label>
                    <select name="cobro" id="cobro" value={form.cobro} onChange={handleChange} className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                      <option defaultValue>Mensual</option>
                      <option>Semanal</option>
                      <option>Diario</option>
                      <option>Anual</option>
                      <option>Único</option>
                    </select>

                  </div>
                </div>
                {/* <!-- End Grid --> */}


                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="encargado" className="block text-sm text-gray-700 font-medium dark:text-white">Encargado</label>
                    <input type="text" name="encargado" id="encargado" value={form.encargado} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="contacto" className="block text-sm text-gray-700 font-medium dark:text-white">Contacto</label>
                    <input type="number" name="contacto" id="contacto" value={form.contacto} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
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


export default RegistrarServicio