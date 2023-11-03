// Función de ayuda para verificar si el usuario está autenticado y su rol
export function isAuthenticated() {
    const token = localStorage.getItem('token');
    return token != null;
  }
  
  export function getUserRole() {
    return localStorage.getItem('rol');
  }
  