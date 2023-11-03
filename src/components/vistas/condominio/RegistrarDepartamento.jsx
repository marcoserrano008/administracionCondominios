import React, { useEffect, useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import { collection, addDoc, getDocs } from "firebase/firestore";
import CheckIcon from '../../../assets/img/check.svg'
import { db } from "../../../firebase";
import { Link, useNavigate } from 'react-router-dom';

const RegistrarDepartamento = () => {
  const navigate = useNavigate();

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);

    // Construyendo el objeto data con la información del formulario
    const deptoData = {
        edificio: formData.get("edificio"),
        numeroDepartamento: formData.get("numeroDepartamento"),
        estado: formData.get("estado"),
        telefono: formData.get("telefono"),
        celular: formData.get("celular"),
        dormitorios: formData.get("dormitorios"),
        banios: formData.get("baños"),
        garaje: formData.get("garaje"),
        superficie: formData.get("superficie"),
    };
    console.log(deptoData)
    try {
      // Cambiando la URL a la de tu API de Laravel
      const response = await fetch('http://127.0.0.1:8000/api/departamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Asegúrate de incluir cualquier cabecera adicional que tu API requiera, como tokens de autenticación
        },
        body: JSON.stringify(deptoData),
      });

      if (response.headers.get("content-type")?.includes("application/json")) {
        const result = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Document written with ID: ", result.id);
        setModalOpen(true);
      } else {
        // No es una respuesta JSON, manejar según sea necesario
        const text = await response.text();
        throw new Error(`No se recibió una respuesta JSON: ${text}`);
      }

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error: no se pudo conectar con la API!");
    }
    setIsSubmitting(false);
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAcceptClick = () => {
    setModalOpen(false);
    navigate('/condominio');
  }

  const [form, setForm] = useState({
    edificio: "",
    numeroDepartamento: "",
    estado: "",
    celular: "",
    telefono: "",
    dormitorios: "",
    baños: "",
    garaje: "",
    superficie: "",
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

  useEffect(() => {
    const fetchEdificios = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/edificios');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const nombresEdificios = data.map(item => item.nombre_edificio);
        setEdificios(nombresEdificios);
      } catch (error) {
        console.error("Error al obtener los edificios:", error);
      }
    };

    fetchEdificios();
  }, []);


  return (
    <>

      {/* <!-- Hire Us --> */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              Registrar Departamento
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Ingrese su informacion
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
                    onChange={handleChange}
                    className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <option value="">N/A</option>
                    {edificios.map((edificio, index) => (
                      <option key={index} value={edificio}>{edificio}</option>
                    ))}
                  </select>
                </div>


                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="numeroDepartamento" className="block text-sm text-gray-700 font-medium dark:text-white">Numero de departamento</label>
                    <input type="text" name="numeroDepartamento" id="numeroDepartamento" value={form.numeroDepartamento} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="estado" className="block text-sm text-gray-700 font-medium dark:text-white">Estado</label>
                    <select name="estado" id="estado" value={form.estado} onChange={handleChange} className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                      <option selected>Ocupado</option>
                      <option>Anticretico</option>
                      <option>Alquiler</option>
                      <option>Venta</option>
                    </select>
                  </div>
                </div>



                {/* <!-- End Grid --> */}


                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="celular" className="block text-sm text-gray-700 font-medium dark:text-white">Celular</label>
                    <input type="number" 
                    required
                    aria-describedby="Complete el campo"
                    name="celular" id="celular" value={form.celular} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm text-gray-700 font-medium dark:text-white">Telefono</label>
                    <input type="number" name="telefono" id="telefono" value={form.telefono} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}

                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="dormitorios" className="block text-sm text-gray-700 font-medium dark:text-white">Nro. de Dormitorios</label>
                    <input type="number" 
                    required
                    aria-describedby="Complete el campo"
                    name="dormitorios" id="dormitorios" value={form.dormitorios} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="baños" className="block text-sm text-gray-700 font-medium dark:text-white">Nro. de Baños</label>
                    <input type="number" 
                    required
                    aria-describedby="Complete el campo"
                    name="baños" id="baños" value={form.baños} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}

                {/* <!-- Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">

                  <div>
                  <label htmlFor="garaje" className="block text-sm text-gray-700 font-medium dark:text-white">Garaje</label>
                    <select name="garaje" id="garaje" value={form.garaje} onChange={handleChange} className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                      <option selected>No</option>
                      <option>Sí</option>
                    </select>
                  </div>


                  <div>
                    <label htmlFor="superficie" className="block text-sm text-gray-700 font-medium dark:text-white">{'Superficie [metros cuadrados]'}</label>
                    <input type="number" 
                    required
                    aria-describedby="Complete el campo"
                    name="superficie" id="superficie" value={form.superficie} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}


              </div>
              {/* <!-- End Grid --> */}




              <div className="mt-6 grid">
                <button type="submit" className="inline-flex justify-center items-center gap-x-3 text-center ${isSubmitting ? 'opacity-20' : 'opacity-100'} bg-blue-600 hover:bg-blue-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800">Registrar
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
            <Link to={'/condominio'}>
              <div className="mt-6 grid">
                <button className="inline-flex justify-center items-center gap-x-3 text-center bg-slate-600 hover:bg-slate-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800">Regresar</button>
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
                <p className="text-sm sm:text-base leading-relaxed text-gray-500">Se registro el departamento</p>

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

export default RegistrarDepartamento