import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Tikras API kvietimas registracijai
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data; // Gauti tokeną ir naudotojo informaciją

        // Išsaugoti tokeną vietos saugykloje
        localStorage.setItem("authToken", token);

        // Login funkcija iš AuthContext
        login(user);

        // Galite peradresuoti į norimą puslapį po registracijos
        console.log("Registracija sėkminga, naudotojas prisijungė");
      } else {
        console.error("Registracijos klaida:", data.message);
      }
    } catch (error) {
      console.error("Registracijos klaida:", error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        className="form-control my-2"
        placeholder="Pasirink vartotojo vardą"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        className="form-control my-2"
        placeholder="El. paštas"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="form-control my-2"
        placeholder="Slaptažodis"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-primary w-100">Registruotis</button>
    </form>
  );
};

export default RegisterForm;
