import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import Header from '../reusables/Header';
import Footer from '../reusables/Footer';
// Asegúrate de importar la configuración de firebase

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const authInstance = getAuth();
    try {
      await signInWithEmailAndPassword(authInstance, email, password);
      navigate('/');
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const authInstance = getAuth();
    try {
      await signInWithEmailAndPassword(authInstance, email, password);
      navigate('/');
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage("Cuenta no valida.");
    }
    setIsSubmitting(false);
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  return (

    <>
      
      <div className="dark:bg-slate-900  flex h-full items-center py-16">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Iniciar Sesion</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  ¿No tienes cuenta?{'  '}
                  {/* Utilizando Link para la navegación */}
                  <Link to="/signup" className="text-blue-600 decoration-2 hover:underline font-medium">
                    Registrarse
                  </Link>


                  <form onSubmit={handleSubmit2}>
                    <div className="grid gap-y-4 mt-2">
                      {/* Form Group: Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm mb-2 dark:text-white text-left">Correo</label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            required
                            aria-describedby="email-error"
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
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            required
                            aria-describedby="password-error"
                          />
                          {/* Este SVG es una representación de un error, puedes mostrarlo según tus necesidades */}
                          {/* ... código del SVG ... */}
                        </div>
                        <p className="hidden text-xs text-red-600 mt-2" id="email-error">Porfavor ingrese su contraseña</p>
                      </div>


                      {/* ... código similar al anterior ... */}
                      {errorMessage && <p className="text-xs text-red-600 mt-2">{errorMessage}</p>}

                      <Button
                        className='bg-slate-200 hover:bg-slate-300'
                        type="submit" >
                        Iniciar Sesion
                        {isSubmitting && ( // Si isSubmitting es true, muestra el spinner
                        <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-orange-600 rounded-full" role="status" aria-label="loading">
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                      </Button>
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

export default Login;
