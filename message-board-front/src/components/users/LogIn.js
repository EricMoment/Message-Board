import React, { useEffect, useState } from "react";
import './LogIn.css'

import { useNavigate } from "react-router-dom";

export default function LogIn({currentUser, setCurrentUser}) {
  const [data, setData] = useState({
    username: '',
    password: '',
  })
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser.username !== 'Guest') { return navigate('/') }
    fetch('http://localhost:5000/user/log-in',{credentials: 'include'})
    .then(response => {
      if (!response.ok) {
        response.json(response).then(json => console.log(json))
        return navigate('/');
      }
      response.json(response).then(json => console.log(json))
    })
  }, [])

  async function handleSubmit(e) { //post
    e.preventDefault();
    await fetch('http://localhost:5000/user/log-in', {
      method: 'POST', //all 3 keys necessary
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include'
    }).then(async response => {
      console.log(response)
      if (!response.ok) {
        setData({...data, password: ''})
        return navigate('/user/log-in')
      }
      setData({username: '', password: ''})
      
      await response.json(response).then(json => {
        console.log(json)
        localStorage.setItem('username', json.username);
        localStorage.setItem('userMessages', json.userMessages)
        setCurrentUser({username: json.username, userMessages: json.userMessages})
      })
      navigate('/')
    })
  }

  function handleChange(e) {
    setData({...data, [e.target.name]: e.target.value})
  }
  return (
    <div className="log-in-form">
      <form onSubmit={handleSubmit}>
      <div className="log-in-title">LOG IN</div>
        <label>
          Username:
          <input type='text' name="username" 
            className="log-in-input" value={data.username} onChange={handleChange}>
          </input>
        </label>
        <label>
          Password:
          <input type='password' name="password" 
            className="log-in-input" value={data.password} onChange={handleChange}>
          </input>
        </label>
        <div className="log-in-submit"><button type="submit">Submit</button></div>
      </form>
    </div>
  )
}