import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

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
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registrarse</button>
      </form>

      <Link to='/'>
        <Button variant='secondary'>
          Inicio
        </Button>
      </Link>
    </div>
  );
}

export default SignUp;
