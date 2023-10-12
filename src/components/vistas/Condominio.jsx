import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import Footer from '../reusables/Footer'
import Header from '../reusables/Header'

const Condominio = () => {
    return (
        <>

            <Header></Header>

            {/* <!-- Card Blog --> */}
            <div className="max-w-[75rem] px-1 py-4 sm:px-6 lg:px-8 lg:py-16 mx-auto lg:mt-[-20px]">
                {/* <!-- Title --> */}
                <div className="max-w-2xl mx-auto text-center mb-4 lg:mb-8">
                    <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">CONDOMINIO</h2>
                </div>
                {/* <!-- End Title --> */}

                {/* <!-- Grid --> */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {/* <!-- Card --> */}
                    <div className="flex justify-center">
                        <div className="group flex flex-col h-full w-5/6  border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 rounded-xl p-5 dark:border-gray-700 dark:hover:border-transparent dark:hover:shadow-black/[.4]">
                            <div className="aspect-w-14 aspect-h-110">
                                <img className="w-full object-cover rounded-xl" src="https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Image Description" />
                            </div>
                            <div className="my-3">
                                <h3 className="text-3xl text-center font-semibold text-gray-800 dark:text-gray-300 dark:group-hover:text-white">
                                    Edificios
                                </h3>
                                <Link to={'/registrarEdificio'}>
                                    <Button className='bg-slate-200 w-full h-12 text-lg mt-2 mb-1 hover:bg-slate-400 hover:shadow-lg transition-all duration-300 '>Registrar Edificio</Button>
                                </Link>

                                <Link to={'/verEdificios'}>
                                    <Button className='bg-slate-200 w-full h-12 text-lg mt-2 mb-1 hover:bg-slate-400 hover:shadow-lg transition-all duration-300'>Ver Edificios</Button>

                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* <!-- End Card --> */}

                    {/* <!-- Card --> */}
                    <div className="flex justify-center">
                        <div className="group flex flex-col h-full w-5/6  border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 rounded-xl p-5 dark:border-gray-700 dark:hover:border-transparent dark:hover:shadow-black/[.4]">
                            <div className="aspect-w-14 aspect-h-110">
                                <img className="w-full object-cover rounded-xl" src="https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Image Description" />
                            </div>
                            <div className="my-3">
                                <h3 className="text-3xl text-center font-semibold text-gray-800 dark:text-gray-300 dark:group-hover:text-white">
                                    Departamentos
                                </h3>
                                <Link to={'/registrarDepartamento'}>
                                    <Button className='bg-slate-200 w-full h-12 text-lg mt-2 mb-1 hover:bg-slate-400 hover:shadow-lg transition-all duration-300 '>Registrar Departamento</Button>
                                </Link>

                                <Link to={'/verDepartamentos'}>
                                    <Button className='bg-slate-200 w-full h-12 text-lg mt-2 mb-1 hover:bg-slate-400 hover:shadow-lg transition-all duration-300'>Ver Departamentos</Button>
                                </Link>

                                <Link to={'/propietariosDepartamentos'}>
                                    <Button className='bg-slate-200 w-full h-12 text-lg mt-2 mb-1 hover:bg-slate-400 hover:shadow-lg transition-all duration-300'>Propietarios</Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* <!-- End Card --> */}

                    {/* <!-- Card --> */}
                    <div className="flex justify-center">
                        <div className="group flex flex-col h-full w-5/6  border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 rounded-xl p-5 dark:border-gray-700 dark:hover:border-transparent dark:hover:shadow-black/[.4]">
                            <div className="aspect-w-14 aspect-h-110">
                                <img className="w-full object-cover rounded-xl" src="https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Image Description" />
                            </div>
                            <div className="my-3">
                                <h3 className="text-3xl text-center font-semibold text-gray-800 dark:text-gray-300 dark:group-hover:text-white">
                                    Casas
                                </h3>
                                <Link to={'/registrarCasa'}>
                                    <Button className='bg-slate-200 w-full h-12 text-lg mt-2 mb-1 hover:bg-slate-400 hover:shadow-lg transition-all duration-300 '>Registrar Casa</Button>
                                </Link>

                                <Link to={'/verCasas'}>
                                    <Button className='bg-slate-200 w-full h-12 text-lg mt-2 mb-1 hover:bg-slate-400 hover:shadow-lg transition-all duration-300'>Ver Casas</Button>
                                </Link>

                                <Link to={'/propietariosCasas'}>
                                    <Button className='bg-slate-200 w-full h-12 text-lg mt-2 mb-1 hover:bg-slate-400 hover:shadow-lg transition-all duration-300'>Propietarios</Button>
                                </Link>

                            </div>
                        </div>
                    </div>
                    {/* <!-- End Card --> */}
                </div>
                {/* <!-- End Grid --> */}

            </div>
            {/* <!-- End Card Blog --> */}

            <Footer></Footer>

        </>
    )
}

export default Condominio