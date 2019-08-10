import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamach from '../assets/itsamatch.png';

export default function Main({ match }) {

  const [devs, setDevs] = useState([]);
  const [matchDev, setMatchDev] = useState(null);
  const matchContainer = useRef(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: match.params.id,
        }
      })
      setDevs(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  useEffect(() => {
    const socket = io.connect('http://localhost:3333', {
      query: {
        user: match.params.id
      }
    });
    socket.on('match', dev => {
      setMatchDev(dev);
      window.scrollTo(0, matchContainer.current.offsetTop);
    });

  }, [match.params.id]);

  async function handleLike(targetId) {
    await api.post(`/devs/${targetId}/likes`, null, {
      headers: {
        user: match.params.id
      }
    })
    setDevs(devs.filter(dev => dev._id !== targetId));
  }

  async function handleDislike(targetId) {
    await api.post(`/devs/${targetId}/dislikes`, null, {
      headers: {
        user: match.params.id
      }
    })
    setDevs(devs.filter(dev => dev._id !== targetId));
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      {devs.length > 0 ? (
        <ul>
          {
            devs.map(dev => (
              <li key={dev._id}>
                <img src={dev.avatar} alt={dev.name} />
                <footer>
                  <strong>{dev.name}</strong>
                  <p>{dev.bio}</p>
                </footer>

                <div className="buttons">
                  <button type="button" onClick={() => handleDislike(dev._id)}>
                    <img src={dislike} alt="dislike" />
                  </button>
                  <button type="button" onClick={() => handleLike(dev._id)}>
                    <img src={like} alt="like" />
                  </button>
                </div>
              </li>
            ))
          }
        </ul>) :
        (<div className="empty">Acabou :(</div>)
      }

      {
        matchDev && (
          <div className="match-container" ref={matchContainer}>
            <img src={itsamach} alt="It's a match!" />
            <img className="avatar" src={matchDev.avatar} alt={matchDev.name} />
            <strong>{matchDev.name}</strong>
            <p>{matchDev.bio}</p>
            <button type="button" onClick={() => setMatchDev(null)}>Fechar </button>
          </div>
        )
      }
    </div>
  );
}