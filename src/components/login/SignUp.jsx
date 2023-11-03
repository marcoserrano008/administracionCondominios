import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import Header from '../reusables/Header';
import Footer from '../reusables/Footer';
import { sendRequest } from '../../functions';
import axios from 'axios';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const rol = 'usuario';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Validación para solo letras y longitud máxima:
    const lettersOnlyRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

    if (!lettersOnlyRegex.test(nombre) || nombre.length > 50) {
      setErrorMessage('El nombre debe contener solo letras y tener un máximo de 50 caracteres.');
      return;
    }

    if (!lettersOnlyRegex.test(apellidoPaterno) || apellidoPaterno.length > 30) {
      setErrorMessage('El apellido paterno debe contener solo letras y tener un máximo de 30 caracteres.');
      return;
    }

    if (!lettersOnlyRegex.test(apellidoMaterno) || apellidoMaterno.length > 30) {
      setErrorMessage('El apellido materno debe contener solo letras y tener un máximo de 30 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    const authInstance = getAuth();

    const db = getFirestore();
    try {

      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const { user } = userCredential;


      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        role: 'usuario',  // Puedes ajustar esto según tus necesidades
        nombre: nombre,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        email: email,
      });

      navigate('/');
    } catch (error) {
      console.error("Error al registrarse:", error);
    }
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
//local version

const csrf = async () => {
  await axios.get('/sanctum/csrf-cookie');
}

const register = async (e) => {
  e.preventDefault();
  await csrf();
  const form = {
    nombre: nombre,
    apellido_paterno: apellidoPaterno,
    apellido_materno: apellidoMaterno,
    rol: rol,
    email:email, 
    password:password};
  const res = await sendRequest('POST', form, '/api/auth/register','',false);
  if(res.status == true){
    storage.set('authToken', res.token);
    storage.set('authUser', res.data);
    navigate('/login');
  }
}

const handleRegister = async (e) => {
  e.preventDefault();
  if (password.length < 8) {
    setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
    return;
  }

  // Validación para solo letras y longitud máxima:
  const lettersOnlyRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

  if (!lettersOnlyRegex.test(nombre) || nombre.length > 50) {
    setErrorMessage('El nombre debe contener solo letras y tener un máximo de 50 caracteres.');
    return;
  }

  if (!lettersOnlyRegex.test(apellidoPaterno) || apellidoPaterno.length > 30) {
    setErrorMessage('El apellido paterno debe contener solo letras y tener un máximo de 30 caracteres.');
    return;
  }

  if (!lettersOnlyRegex.test(apellidoMaterno) || apellidoMaterno.length > 30) {
    setErrorMessage('El apellido materno debe contener solo letras y tener un máximo de 30 caracteres.');
    return;
  }
  if (password !== confirmPassword) {
    setErrorMessage('Las contraseñas no coinciden.');
    return;
  }

  try {
    const inputs = {
      email: email,
      password: password,
      name: nombre,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno: apellidoMaterno,
      rol: rol, 
    }
    const response = await axios.post('http://127.0.0.1:8000/api/register', inputs);
    console.log(response.data);
    navigate('/login');
    // Aquí puedes manejar la redirección o actualización de estado post-registro.
  } catch (error) {
    console.error(error.response.data);
  }
};


  return (
    <>

      <div className="dark:bg-slate-900  flex h-full items-center py-16">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Registrarse</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">

                  <form onSubmit={handleRegister}>

                    <div className="grid gap-y-4 mt-2">
                      <div>
                        <label htmlFor="nombre" className="block text-sm mb-2 dark:text-white text-left">Nombre</label>
                        <input type="text"
                          required
                          aria-describedby="Complete el campo"
                          name="nombre" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                      </div>

                      <div>
                        <label htmlFor="apellidoPaterno" className="block text-sm mb-2 dark:text-white text-left">Apellido Paterno</label>
                        <input type="text"
                          required
                          aria-describedby="Complete el campo"
                          name="apellidoPaterno" id="apellidoPaterno" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                      </div>

                      <div>
                        <label htmlFor="apellidoMaterno" className="block text-sm mb-2 dark:text-white text-left">Apellido Materno</label>
                        <input type="text"
                          required
                          aria-describedby="Complete el campo"
                          name="apellidoMaterno" id="apellidoMaterno" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
                      </div>

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

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm mb-2 dark:text-white text-left">Confirmar Contraseña</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="Confirmar Contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}

                            className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            required
                            aria-describedby="Confirme su contraseña"
                          />
                          {/* Si necesitas un SVG para representar un error, puedes agregarlo aquí */}
                        </div>
                      </div>
                      {/* ... código similar al anterior ... */}

                      {errorMessage && <p className="text-xs text-red-600 mt-2">{errorMessage}</p>}
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
