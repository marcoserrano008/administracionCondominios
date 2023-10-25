import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import edificioIcono from '../../assets/img/edificioIcono.svg'
import { useAuth } from '../../auth/AuthContext';
import { getAuth } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db, app } from '../../firebase';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Usa el hook useAuth para obtener el usuario
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    if (user) {
      fetchUserRole(user.uid).then((role) => {
        setUserRole(role);
      });
    }
  }, [user]);

  const [activeLink, setActiveLink] = useState("");
  const handleSetActiveLink = (linkName) => {
    setActiveLink(linkName);
  }


  const fetchUserRole = async (uid) => {
    try {
      const userRef = doc(db, "users", uid); // Asumiendo que tu colección se llama "users"
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        return userSnapshot.data().role; // Retorna el rol del usuario
      } else {
        console.error("No se encontró el documento del usuario");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el rol:", error);
      return null;
    }
  }

  const handleLogout = async () => {
    try {
      const authInstance = getAuth();
      await signOut(authInstance);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  return (
    <>
      <header>
        <nav className="bg-slate-200 border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <Link to={'/'} className="flex items-center">
              <img src={edificioIcono} className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Sistema</span>
            </Link>
            <div className="flex items-center lg:order-2">
              {!user && (
                <>
                  <Link to={'/login'} className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                    Iniciar Sesión
                  </Link>
                  <Link to={'/signup'} className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                    Registrarse
                  </Link>
                </>
              )}

              {user && (
                <>
                  <button onClick={handleLogout} className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                    Cerrar Sesion
                  </button>
                </>
              )}


              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded={menuOpen ? 'true' : 'false'}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect y="3" width="24" height="2" fill="black" />
                  <rect y="11" width="24" height="2" fill="black" />
                  <rect y="19" width="24" height="2" fill="black" />
                </svg>
                <span className="sr-only">Open main menu</span>
              </button>

            </div>
            <div className={`${menuOpen ? '' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`} id="mobile-menu-2">

              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                {user && userRole === 'administrador' && (
                  <>

                    <li>
                      <Link to="/servicios"
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'servicios' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('servicios')}
                      >
                        Servicios
                      </Link>
                    </li>
                    <li>
                      <Link to="/condominio"
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'condominio' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('condominio')}
                      >
                        Condominio
                      </Link>

                    </li>


                    <li>
                      <Link to='/personal'
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'personal' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('personal')}
                      >
                        Personal
                      </Link>
                    </li>
                    <li>
                      <Link to='/visitas' 
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'visitas' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('visitas')}
                      >
                        Visitas
                      </Link>
                    </li>
                    <li>
                      <Link to='/anuncios' 
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'anuncios' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('anuncios')}
                      >
                        Anuncios
                      </Link>
                    </li>

                    <li>
                      <Link to='/usuarios'
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'usuarios' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('usuarios')}
                      >
                        Usuarios
                      </Link>
                    </li>

                  </>

                )}

                {user && userRole === 'guardia' && (
                  <>

<li>
                      <Link to="/servicios"
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'servicios' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('servicios')}
                      >
                        Servicios
                      </Link>
                    </li>

                   <li>
                      <Link to='/visitas' 
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'visitas' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('visitas')}
                      >
                        Visitas
                      </Link>
                    </li>
                    <li>
                      <Link to='/anuncios' 
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'anuncios' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('anuncios')}
                      >
                        Anuncios
                      </Link>
                    </li>
                  </>

                )}

                {user && userRole === 'usuario' && (
                  <>
                    <li>
                      <Link to='/anuncios' 
                        className={`block py-2 pr-4 pl-3 ${activeLink === 'anuncios' ? 'text-primary-700' : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50'} text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"`}
                        onClick={() => handleSetActiveLink('anuncios')}
                      >
                        Anuncios
                      </Link>
                    </li>
                  </>

                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header