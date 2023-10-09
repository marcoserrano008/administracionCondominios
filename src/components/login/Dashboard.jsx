import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../auth/AuthContext';
import { useState, useEffect } from 'react';
const Dashboard = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', auth.user.uid));

      if (userDoc.exists()) {
        setRole(userDoc.data().role);
      } else {
        console.error('No se encontró el usuario en la base de datos');
      }
    };

    fetchUserRole();
  }, [auth.user]);

  const handleLogout = async () => {
    try {
      const authInstance = getAuth();
      await signOut(authInstance);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (role === 'admin') {
    return (
      <div>
        Dashboard de administrador
        {/* Aquí tu contenido para administrador */}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    );
  }

  if (role === 'user') {
    return (
      <div>
        Dashboard de usuario
        {/* Aquí tu contenido para usuarios normales */}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    );
  }

  // Mientras se carga el rol
  return <div>Cargando...</div>;


  return (
    <div>
      Dashboard de marco

      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Dashboard;
