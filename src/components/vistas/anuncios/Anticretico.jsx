import React, { useEffect, useState } from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import { db } from '../../../firebase'
import { collection, getDocs } from 'firebase/firestore';

const Anticretico = () => {
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/anuncios');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
  
        // Actualizar la URL de la imagen a la estructura deseada si es necesario
        const updatedData = data.map(anuncio => ({
          ...anuncio,
          // Comprobar si imagenReferencia es no nulo y actualizar la URL en consecuencia
          imagenReferencia: anuncio.imagenReferencia 
            ? `http://localhost:8000/storage/anuncios/${anuncio.imagenReferencia.split('/').pop()}` 
            : null, // o podrías tener una imagen por defecto aquí
        }));
  
        setAnuncios(updatedData);
      } catch (error) {
        console.error("Error al cargar anuncios: ", error);
      }
    };
  
    fetchAnuncios();
  }, []);


  //Modal para ver mas detalles
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnuncio, setSelectedAnuncio] = useState(null);



  function openModal(anuncio) {
    setSelectedAnuncio(anuncio);
    setIsOpen(true);
  }

  return (
    <>
  
      <div className="max-w-2xl mx-auto text-center mb-4 lg:mb-8">
        <h2 className="text-2xl font-bold md:text-4xl mt-10 md:leading-tight dark:text-white">ANUNCIOS</h2>
      </div>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {anuncios.map((anuncio, index) => (
            <div key={index} className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
              <div className="h-52 bg-blue-600 rounded-t-xl overflow-hidden">
                <img className="w-full h-full object-cover object-center" src={anuncio.imagenReferencia} alt="Imagen Referencia" />
              </div>
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-300 dark:hover:text-white">
                    $us {anuncio.precio}
                  </h3>
                  <span className={`inline-flex items-center gap-1.5 py-1.5 px-8 rounded-full text-xl font-medium ${getBadgeColor(anuncio.tipo)} text-white`}>{anuncio.tipo}</span>

                </div>
                <p className="mt-3 text-xl text-gray-500">
                Numero Departamento: {anuncio.numeroDepartamento}
                </p>
                <p className="mt-3 text-xl text-gray-500">
                  Edificio: {anuncio.edificio}
                </p>
              </div>
              <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
                <button
                  onClick={() => openModal(anuncio)}
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-bl-xl font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm sm:p-4 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800" href="#">
                  Ver mas detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOpen && selectedAnuncio && (
        <>
          {/* Modal Background */}
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsOpen(false)}></div>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-md max-w-xl w-full">
              <button onClick={() => setIsOpen(false)}>X</button>
              <img className="w-full h-52 object-cover" src={selectedAnuncio.imagenReferencia} alt="Imagen Referencia" />
              <h3 className="text-2xl font-bold">$us {selectedAnuncio.precio}</h3>
              <span className={`inline-flex items-center gap-1.5 py-1.5 px-8 rounded-full text-xl font-medium ${getBadgeColor(selectedAnuncio.tipo)} text-white`}>{selectedAnuncio.tipo}</span>
              <p className="mt-3 text-xl text-gray-500">Numero Departamento: {selectedAnuncio.numeroDepartamento}</p>
              <p className="mt-3 text-xl text-gray-500">Edificio: {selectedAnuncio.edificio}</p>
              <p className="mt-3">{selectedAnuncio.descripcion}</p>
              <p>Contacto 1: {selectedAnuncio.contacto1}</p>
              <p>Contacto 2: {selectedAnuncio.contacto2}</p>
            </div>
          </div>
        </>
      )}



      <Footer />


    </>

  )
}



function getBadgeColor(tipo) {
  switch (tipo) {
    case 'Venta':
      return 'bg-blue-500';
    case 'Alquiler':
      return 'bg-orange-500';
    case 'Anticretico':
      return 'bg-green-500';
    default:
      return 'bg-gray-500'; // Un color por defecto en caso de que no coincida con ninguno de los anteriores
  }
}
export default Anticretico