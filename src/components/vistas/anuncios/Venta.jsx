import React, { useEffect, useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


import { db } from "../../../firebase";
import { useNavigate } from 'react-router-dom';


const Venta = () => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const [form, setForm] = useState({
    edificio: "",
    numeroDepartamento: "",
    tipo: '',
    precio: '',
    contacto1: '',
    contacto2: '',
    descripcion: '',
  });

  const [fechaHoraPublicacion, setFechaHoraPublicacion] = useState(getGTMMinus4Date());
  //Cargar los edificios al dropdown
  const [edificios, setEdificios] = useState([]);

  useEffect(() => {
    const fetchEdificios = async () => {
      const edificiosCollection = collection(db, "edificios");
      const edificiosSnapshot = await getDocs(edificiosCollection);
      const edificiosList = edificiosSnapshot.docs.map(doc => doc.data().nombre_edificio);
      setEdificios(edificiosList);
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

  //Manejar la imagen
  const [imageFile, setImageFile] = useState(null);

  const handleChangeImage = (event) => {
    setImageFile(event.target.files[0]);
  };

  //Submit Imagen
  const storage = getStorage();
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        // 1. Subir imagen a Firebase Storage
        if (imageFile) {
            const storageRef = ref(storage, 'imagenes/' + imageFile.name);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progreso del envío...
                },
                (error) => {
                    console.error("Error al subir archivo: ", error);
                },
                async () => {
                    // Cuando se completa el envío, obten el enlace de descarga
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // 2. Guardar datos en Firestore con la URL de la imagen
                    const docRef = await addDoc(collection(db, "anuncios"), {
                        // ... otros campos del formulario
                        imagenReferencia: downloadURL,
                        edificio: formData.get('edificio'),
                        numeroDepartamento: formData.get('numeroDepartamento'),
                        tipo: formData.get('tipo'),
                        precio: formData.get('precio'),
                        contacto1: formData.get('contacto1'),
                        contacto2: formData.get('contacto2'),
                        descripcion: formData.get('descripcion'),
                        fechaHoraPublicacion: fechaHoraPublicacion,
                    });

                    console.log("Documento escrito con ID: ", docRef.id);
                    alert("Registro satisfactorio!");
                    navigate('/condominio');
                }
            );
        } else {
            const docRef = await addDoc(collection(db, "anuncios"), {
                // ... otros campos del formulario sin la imagen
            });

            console.log("Documento escrito con ID: ", docRef.id);
            alert("Registro satisfactorio!");
            navigate('/condominio');
        }
    } catch (error) {
        console.error("Error al agregar documento: ", error);
        alert("Error: no está conectado!");
    }
};

  return (
    <>
      <Header />

      {/* <!-- Hire Us --> */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              Publicar Anuncio
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
                    <label htmlFor="tipo" className="block text-sm text-gray-700 font-medium dark:text-white">Tipo de anuncio</label>
                    <select name="tipo" id="tipo" value={form.estado} onChange={handleChange} className="py-3 px-4 pr-9 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
                      <option defaultValue>Anticretico</option>
                      <option>Alquiler</option>
                      <option>Venta</option>
                    </select>
                  </div>


                  <div>
                    <label htmlFor="precio" className="block text-sm text-gray-700 font-medium dark:text-white">{'Precio [$us]'}</label>
                    <input type="number" name="precio" id="precio" value={form.cantidad_pisos} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}


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
                    <label htmlFor="contacto1" className="block text-sm text-gray-700 font-medium dark:text-white">Numero de referencia 1</label>
                    <input type="number" name="contacto1" id="contacto1" value={form.nombre_edificio} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

                  <div>
                    <label htmlFor="contacto2" className="block text-sm text-gray-700 font-medium dark:text-white">Numero de referencia 2</label>
                    <input type="number" name="contacto2" id="contacto2" value={form.cantidad_pisos} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>
                </div>
                {/* <!-- End Grid --> */}


                <div>
                  <label htmlFor="descripcion" className="block text-sm text-gray-700 font-medium dark:text-white">Descripcion</label>
                  <input type="text" name="descripcion" id="descripcion" value={form.direccion} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                </div>



                  <div>
                    <label htmlFor="imagenReferencia" className="block text-sm text-gray-700 font-medium dark:text-white">Imagen de referencia</label>
                    <input type="file" name="imagenReferencia" id="imagenReferencia" onChange={handleChangeImage}
                      className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                  </div>

              </div>
              {/* <!-- End Grid --> */}
              <div className="mt-6 grid">
                <button type="submit" className="inline-flex justify-center items-center gap-x-3 text-center bg-blue-600 hover:bg-blue-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800">Publicar</button>
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
  );
};

function getGTMMinus4Date() {
  const now = new Date(); // Obtiene la fecha/hora actual
  const timezoneOffset = now.getTimezoneOffset(); // Obtiene la diferencia en minutos con respecto a GMT
  const desiredOffset = 4 * 60; // El desfase que deseas (4 horas para GMT-4)

  // Ajustamos la fecha/hora actual a GMT-4
  now.setMinutes(now.getMinutes() + timezoneOffset - desiredOffset);

  return now; // Retorna el objeto Date
}


export default Venta;
