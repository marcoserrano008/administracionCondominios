import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import Header from '../reusables/Header'
import Footer from '../reusables/Footer'
import ingresoImagen from '../../assets/img/ingreso.png'
import salidaImagen from '../../assets/img/salida.png'
import guardiaImagen from '../../assets/img/guardia.png'
import condominioImagen from '../../assets/img/condominio.jpg'
const Anuncios = () => {
    return (
        <>
<Header></Header>
            {/* <!-- Features --> */}
            <div className='flex justify-center items-center min-h-auto lg:mt-20' >
            <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto bg-red-200">
                <div class="relative p-6 md:p-16">
                    {/* <!-- Grid --> */}
                    <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center ">
                        <div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
                            <h2 className="text-2xl text-gray-800 font-bold sm:text-3xl dark:text-gray-200">
                                Anuncios
                            </h2>

                            {/* <!-- Tab Navs --> */}
                            <nav className="grid gap-4 mt-5 md:mt-10" aria-label="Tabs" role="tablist">
                                <button type="button" className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-left hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-slate-900 dark:hover:bg-gray-700 active" id="tabs-with-card-item-1" data-hs-tab="#tabs-with-card-1" aria-controls="tabs-with-card-1" role="tab">
                                    <span className="flex">
                                        <img
                                            className="flex-shrink-0 mt-2 h-6 w-6 md:w-7 md:h-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-gray-200"
                                            src={ingresoImagen}
                                            alt="Descripción de la imagen"
                                        />
                                        <span className="grow ml-6">
                                            <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-gray-200">Venta</span>
                                            <span className="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-gray-200">Lista detallada de los anuncios.</span>
                                        </span>
                                    </span>
                                </button>

                                <button type="button" className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-left hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-slate-900 dark:hover:bg-gray-700" id="tabs-with-card-item-2" data-hs-tab="#tabs-with-card-2" aria-controls="tabs-with-card-2" role="tab">
                                    <span className="flex">
                                        <img
                                            className="flex-shrink-0 mt-2 h-6 w-6 md:w-7 md:h-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-gray-200"
                                            src={salidaImagen}
                                            alt="Descripción de la imagen"
                                        />
                                        <span className="grow ml-6">
                                            <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-gray-200">Alquiler</span>
                                            <span className="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-gray-200">Compartir una publicacion.</span>
                                        </span>
                                    </span>
                                </button>

                                <button type="button" className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-left hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-slate-900 dark:hover:bg-gray-700" id="tabs-with-card-item-3" data-hs-tab="#tabs-with-card-3" aria-controls="tabs-with-card-3" role="tab">
                                    <span className="flex">
                                        <img
                                            className="flex-shrink-0 mt-2 h-6 w-6 md:w-7 md:h-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-gray-200"
                                            src={guardiaImagen}
                                            alt="Descripción de la imagen"
                                        />
                                        <span className="grow ml-6">
                                            <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-gray-200">Anticretico</span>
                                            <span className="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-gray-200">Ver una lista de los vigilantes.</span>
                                        </span>
                                    </span>
                                </button>
                            </nav>
                            {/* <!-- End Tab Navs --> */}
                        </div>
                        {/* <!-- End Col --> */}

                        <div className="lg:col-span-6">
                            <div className="relative">
                                {/* <!-- Tab Content --> */}
                                <div>
                                    <div id="tabs-with-card-1" role="tabpanel" aria-labelledby="tabs-with-card-item-1">
                                        <img className="shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/[.2]" src={condominioImagen} alt="Image Description" />
                                    </div>

                                    <div id="tabs-with-card-2" className="hidden" role="tabpanel" aria-labelledby="tabs-with-card-item-2">
                                        <img className="shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/[.2]" src="https://images.unsplash.com/photo-1665686306574-1ace09918530?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&h=1220&q=80" alt="Image Description" />
                                    </div>

                                    <div id="tabs-with-card-3" className="hidden" role="tabpanel" aria-labelledby="tabs-with-card-item-3">
                                        <img className="shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/[.2]" src="https://images.unsplash.com/photo-1598929213452-52d72f63e307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&h=1220&q=80" alt="Image Description" />
                                    </div>
                                </div>
                                {/* <!-- End Tab Content --> */}

                                {/* <!-- SVG Element --> */}
                                <div className="hidden absolute top-0 right-0 translate-x-20 md:block lg:translate-x-20">
                                    <svg className="w-16 h-auto text-orange-500" width="121" height="135" viewBox="0 0 121 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164" stroke="currentColor" stroke-width="10" stroke-linecap="round" />
                                        <path d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5" stroke="currentColor" stroke-width="10" stroke-linecap="round" />
                                        <path d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874" stroke="currentColor" stroke-width="10" stroke-linecap="round" />
                                    </svg>
                                </div>
                                {/* <!-- End SVG Element --> */}
                            </div>
                        </div>
                        {/* <!-- End Col --> */}
                    </div>
                    {/* <!-- End Grid --> */}

                    {/* <!-- Background Color --> */}
                    <div className="absolute inset-0 grid grid-cols-12 w-full h-full">
                        <div className="col-span-full lg:col-span-7 lg:col-start-6 bg-gray-100 w-full  rounded-xl sm:h-3/4 lg:h-full dark:bg-white/[.075]"></div>
                    </div>
                    {/* <!-- End Background Color --> */}
                </div>
            </div>
            </div>

            {/* <!-- End Features --> */}

            <Footer></Footer>
        </>
    )
}

export default Anuncios