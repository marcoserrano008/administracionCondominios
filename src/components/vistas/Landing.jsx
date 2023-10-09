import React from 'react'
import Header from '../reusables/Header'
import Footer from '../reusables/Footer'

const Landing = () => {
  return (
    <>
      <Header></Header>
      <>
        {/* <!-- Hero --> */}
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          {/* <!-- Grid --> */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
            <div>
              <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">Sistema de administracion de  condominios<span className="text-blue-600"> SISCON</span></h1>
              <p className="mt-3 text-lg text-gray-800 dark:text-gray-400">Hand-picked professionals and expertly crafted components, designed for any kind of entrepreneur.</p>
              {/* 
              <!-- Buttons --> */}
              <div className="mt-7 grid  gap-3 w-full sm:inline-flex">
                <a className="inline-flex justify-center items-center gap-x-3 text-center bg-blue-600 hover:bg-blue-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800" href="#">
                  Get started
                  <svg className="w-2.5 h-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </a>
                <a className="inline-flex justify-center items-center gap-x-3.5 text-sm lg:text-base text-center border hover:border-gray-300 shadow-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:border-gray-800 dark:hover:border-gray-600 dark:shadow-slate-700/[.7] dark:text-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" href="#">
                  Contact sales team
                </a>
              </div>
              {/* <!-- End Buttons -->

              <!-- Review --> */}
              <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5">
                {/* <!-- Review --> */}
                <div className="py-5">
                  



                </div>
                {/* <!-- End Review --> */}

                {/* <!-- Review --> */}
                <div className="py-5">



                </div>
                {/* <!-- End Review --> */}
              </div>
              {/* <!-- End Review --> */}
            </div>
            {/* <!-- End Col --> */}

            <div className="relative ml-4">
              <img
                className="w-full rounded-md"
                src="https://images.unsplash.com/photo-1665686377065-08ba896d16fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=800&q=80"
                alt="Image Description"
              />
              <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 mr-4 -ml-4 lg:mt-6 lg:-mb-6 lg:mr-6 lg:-ml-6 dark:from-slate-800 dark:via-slate-900/0 dark:to-slate-900/0"></div>

              {/* <!-- SVG--> */}
              <div className="absolute bottom-0 left-0">
                <svg className="w-2/3 ml-auto h-auto text-white dark:text-slate-900" width="630" height="451" viewBox="0 0 630 451" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="531" y="352" width="99" height="99" fill="currentColor" />
                  <rect x="140" y="352" width="106" height="99" fill="currentColor" />
                  <rect x="482" y="402" width="64" height="49" fill="currentColor" />
                  <rect x="433" y="402" width="63" height="49" fill="currentColor" />
                  <rect x="384" y="352" width="49" height="50" fill="currentColor" />
                  <rect x="531" y="328" width="50" height="50" fill="currentColor" />
                  <rect x="99" y="303" width="49" height="58" fill="currentColor" />
                  <rect x="99" y="352" width="49" height="50" fill="currentColor" />
                  <rect x="99" y="392" width="49" height="59" fill="currentColor" />
                  <rect x="44" y="402" width="66" height="49" fill="currentColor" />
                  <rect x="234" y="402" width="62" height="49" fill="currentColor" />
                  <rect x="334" y="303" width="50" height="49" fill="currentColor" />
                  <rect x="581" width="49" height="49" fill="currentColor" />
                  <rect x="581" width="49" height="64" fill="currentColor" />
                  <rect x="482" y="123" width="49" height="49" fill="currentColor" />
                  <rect x="507" y="124" width="49" height="24" fill="currentColor" />
                  <rect x="531" y="49" width="99" height="99" fill="currentColor" />
                </svg>
              </div>
              {/* <!-- End SVG--> */}
            </div>
            {/* <!-- End Col --> */}
          </div>
          {/* <!-- End Grid --> */}
        </div>
        {/* <!-- End Hero --> */}
      </>

      <Footer></Footer>
    </>
  )
}

export default Landing