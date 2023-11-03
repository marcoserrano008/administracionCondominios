import axios from "axios";
import storage from "./storage/storage";

export const show_alerta = (msj) => {
    alert(msj)
}

export const sendRequest = async (method, params, url, redir = '', token = true) => {
    try {
      if (token) {
        const authToken = storage.get('authToken');
        console.log(authToken)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
      }
  
      const response = await axios({ method, url, data: params });
  
      const res = response.data;
      if (method !== 'GET') {
        show_alerta(res.message, 'success');
      }
  
      if (redir !== '') {
        setTimeout(() => {
          window.location.href = redir;
        }, 2000);
      }
  
      return res;
    } catch (error) {
      let desc = '';
      const res = error.response.data;
      if (res.errors) {
        desc = res.errors.map((e) => '' + e).join(' ');
      } else {
        desc = res.message || 'Error desconocido';
      }
      show_alerta(desc);
      return res;
    }
  };
  

export const confirmation = async (name, url, redir) => {
    sendRequest('DELETE', {}, url, redir);
}

export default show_alerta;