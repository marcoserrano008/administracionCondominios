import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import Header from '../reusables/Header';
import Footer from '../reusables/Footer';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authInstance = getAuth();

    const db = getFirestore();
    try {

      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const { user } = userCredential;


      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        role: 'user',  // Puedes ajustar esto según tus necesidades
        name: 'marco' /* valor del nombre del formulario */,
        lastName: 'testing'/* valor del apellido del formulario */
      });

      navigate('/dashboard');
    } catch (error) {
      console.error("Error al registrarse:", error);
    }
  };

  return (
    <>
      <Header></Header>
      <div className="dark:bg-slate-900  flex h-full items-center py-16">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Registrarse</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">

                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-y-4 mt-2">
                      {/* Form Group: Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm mb-2 dark:text-white text-left">Correo</label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}

                            className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            required
                            aria-describedby="Ingrese un email"
                          />
                          {/* Este SVG es una representación de un error, puedes mostrarlo según tus necesidades */}
                          {/* ... código del SVG ... */}
                        </div>
                        <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                      </div>

                      {/* Form Group: Password */}

                      <div>
                        <label htmlFor="password" className="block text-sm mb-2 dark:text-white text-left">Contraseña</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                            className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            required
                            aria-describedby="Ingrese una contraseña"
                          />
                          {/* Este SVG es una representación de un error, puedes mostrarlo según tus necesidades */}
                          {/* ... código del SVG ... */}
                        </div>
                        <p className="hidden text-xs text-red-600 mt-2" id="email-error">Porfavor ingrese su contraseña</p>
                      </div>
                      {/* ... código similar al anterior ... */}

                      <Button className='bg-slate-200 hover:bg-slate-300' type="submit" >
                        Registrarse
                      </Button>

                      <Link to='/' className="block w-full">
                      </Link>

                      {/* <button type="submit" className="...tus clases aquí...">Iniciar Sesion</button> */}
                    </div>
                  </form>
                </p>
              </div>
              <div className="mt-5">
                {/* Aquí continuaría el resto de tu código */}
              </div>
            </div>
          </div>
        </div>
      </div>

    <Footer></Footer>


    </>

  );
}

export default SignUp;
