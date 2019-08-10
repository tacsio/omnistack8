import React, { useState } from 'react';

import api from '../services/api';

import './Login.css';
import logo from '../assets/logo.svg';

export default function Login({ history }) {
  const [username, setUsername] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await api.post('/devs',{username,});
    const { _id } = response.data;

    const path = `/dev/${_id}`;
    history.push(path);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img style={{cursor: "pointer"}} className="logo" src={logo} alt="Tindev"/>
        <input 
          placeholder="Digite seu usuário do Github" 
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}