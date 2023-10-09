import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

function PrivateRoute({ children }) {  // <-- Asegúrate de destructurar children aquí
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    navigate('/login'); 
    return null;
  }

  return children;  // <-- Renderiza los hijos directamente
}

export default PrivateRoute;