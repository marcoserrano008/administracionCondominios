import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCgnqVXZSn5Bb-lencH-IPVkeIcJkuIUOo",
    authDomain: "condominio-adm.firebaseapp.com",
    projectId: "condominio-adm",
    storageBucket: "condominio-adm.appspot.com",
    messagingSenderId: "475680097285",
    appId: "1:475680097285:web:1c3d7e2b2cb31fb75fc86c"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  export { auth };