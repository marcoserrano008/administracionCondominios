import React from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'
import TablaDepartamentos from './TablaDepartamentos'
import { Link } from 'react-router-dom'

const VerDepartamentos = () => {
  return (
    <>
      <Header />
      

      <div className="max-w-[105rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">

                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                      Departamentos
                    </h2>
                  </div>

                  <div>
                    <div className="inline-flex gap-x-2">


                      <Link to={'/condominio'} className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800" href="#">
                        Regresar
                      </Link>

                
                    </div>
                  </div>
                </div>

                <TablaDepartamentos></TablaDepartamentos>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default VerDepartamentos