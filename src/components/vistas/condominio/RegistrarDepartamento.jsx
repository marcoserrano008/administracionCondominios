import React from 'react'
import Header from '../../reusables/Header'
import Footer from '../../reusables/Footer'

const RegistrarDepartamento = () => {
  return (
    <>
    <Header/>
    <div>RegistrarDepartamento</div>

    {/* <!-- Hire Us --> */}
<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  <div className="max-w-xl mx-auto">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
        Ready to hire us?
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Tell us your story and we’ll be in touch.
      </p>
    </div>

    <div className="mt-12">
      {/* <!-- Form --> */}
      <form>
        <div className="grid gap-4 lg:gap-6">
          {/* <!-- Grid --> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label for="hs-firstname-hire-us-2" className="block text-sm text-gray-700 font-medium dark:text-white">First Name</label>
              <input type="text" name="hs-firstname-hire-us-2" id="hs-firstname-hire-us-2" className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"/>
            </div>

            <div>
              <label for="hs-lastname-hire-us-2" className="block text-sm text-gray-700 font-medium dark:text-white">Last Name</label>
              <input type="text" name="hs-lastname-hire-us-2" id="hs-lastname-hire-us-2" className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"/>
            </div>
          </div>
          {/* <!-- End Grid --> */}

          <div>
            <label for="hs-work-email-hire-us-2" className="block text-sm text-gray-700 font-medium dark:text-white">Work Email</label>
            <input type="email" name="hs-work-email-hire-us-2" id="hs-work-email-hire-us-2" autocomplete="email" className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"/>
          </div>

          {/* <!-- Grid --> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label for="hs-company-hire-us-2" className="block text-sm text-gray-700 font-medium dark:text-white">Company</label>
              <input type="text" name="hs-company-hire-us-2" id="hs-company-hire-us-2" className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"/>
            </div>

            <div>
              <label for="hs-company-website-hire-us-2" className="block text-sm text-gray-700 font-medium dark:text-white">Company Website</label>
              <input type="text" name="hs-company-website-hire-us-2" id="hs-company-website-hire-us-2" className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"/>
            </div>
          </div>
          {/* <!-- End Grid --> */}

          <div>
            <label for="hs-about-hire-us-2" className="block text-sm text-gray-700 font-medium dark:text-white">Details</label>
            <textarea id="hs-about-hire-us-2" name="hs-about-hire-us-2" rows="4" className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"></textarea>
          </div>
        </div>
        {/* <!-- End Grid --> */}

        {/* <!-- Checkbox --> */}
        <div className="mt-3 flex">
          <div className="flex">
            <input id="remember-me" name="remember-me" type="checkbox" className="shrink-0 mt-1.5 border border-gray-300 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"/>
          </div>
          <div className="ml-3">
            <label for="remember-me" className="text-sm text-gray-600 dark:text-gray-400">By submitting this form I have read and acknowledged the <a className="text-blue-600 decoration-2 hover:underline font-medium" href="#">Privact policy</a></label>
          </div>
        </div>
        {/* <!-- End Checkbox --> */}

        <div className="mt-6 grid">
          <button type="submit" className="inline-flex justify-center items-center gap-x-3 text-center bg-blue-600 hover:bg-blue-700 border border-transparent text-sm lg:text-base text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4 dark:focus:ring-offset-gray-800">Send inquiry</button>
        </div>

        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            We'll get back to you in 1-2 business days.
          </p>
        </div>
      </form>
      {/* <!-- End Form --> */}
    </div>
  </div>
</div>
{/* <!-- End Hire Us --> */}

    <Footer/>
    </>
  )
}

export default RegistrarDepartamento