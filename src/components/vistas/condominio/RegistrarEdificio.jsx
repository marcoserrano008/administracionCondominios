import React, { useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import {collection, addDoc } from "firebase/firestore";

import { db } from "../../../firebase";
import { useNavigate } from 'react-router-dom';

const RegistrarEdificio = () => {

  const navigate = useNavigate();
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
      const docRef = await addDoc(collection(db, "edificios"), {
        nombre_edificio: formData.get("nombre_edificio"),
        cantidad_pisos: formData.get("cantidad_pisos"),
        direccion: formData.get("direccion"),
        celular: formData.get("celular"),
        telefono: formData.get("telefono"),
        correo: formData.get("correo")

        
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Registro satisfactorio!");
      navigate('/condominio');
      
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
              Registrar Edificio
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
                    <label htmlFor="nombre_edificio" className="block text-sm text-gray-700 font-medium dark:text-white">Nombre del edificio</label>
                    <input type="text" name="nombre_edificio" id="nombre_edificio" value={form.nombre_edificio} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="cantidad_pisos" className="block text-sm text-gray-700 font-medium dark:text-white">Numero de pisos</label>
                    <input type="number" name="cantidad_pisos" id="cantidad_pisos" value={form.cantidad_pisos} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}

                <div>
                  <label htmlFor="direccion" className="block text-sm text-gray-700 font-medium dark:text-white">Direccion</label>
                  <input type="text" name="direccion" id="direccion" value={form.direccion} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                </div>

                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="celular" className="block text-sm text-gray-700 font-medium dark:text-white">Celular</label>
                    <input type="number" name="celular" id="celular" value={form.celular} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm text-gray-700 font-medium dark:text-white">Telefono</label>
                    <input type="number" name="telefono" id="telefono" value={form.telefono} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}
                <div>
                <label htmlFor="correo" className="block text-sm text-gray-700 font-medium dark:text-white">Correo Electronico</label>
                <input type="email" name="correo" id="correo" value={form.correo} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
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

export default RegistrarEdificio