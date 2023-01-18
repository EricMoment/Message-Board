import React, { useEffect, useState } from "react";
import './SignUp.css'

import { useNavigate } from "react-router-dom";

export default function SignUp({currentUser}) {
  const [data, setData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errMessage, setErrMessage] = useState()
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser.username !== 'Guest') return navigate('/')
    async function c() {
      await fetch('http://localhost:5000/user/sign-up', {credentials: 'include'})
        .then( async response => {
        console.log(response)
        if (!response.ok) { return navigate('/') }
        await response.json(response)
        .then(json => console.log(json))
      })
    }
    c()
  }, [])

  async function handleSubmit(e) { //post
    e.preventDefault();
    await fetch('http://localhost:5000/user/sign-up', {
      method: 'POST', //all 3 keys necessary
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    }).then( async response => {
      if (!response.ok) {
        setData({...data, password: '', confirmPassword: ''})
        await response.json(response).then(json => console.log(json))
        navigate('/user/sign-up')
        return
      }
      setData({username: '', password: '', confirmPassword: ''})
      navigate('/user/log-in')
      await response.json(response).then(json => console.log(json))
    })
  }

  function handleChange(e) {
    setData({...data, [e.target.name]: e.target.value})
  }
  return (
    <div className="sign-up-form">
      <form onSubmit={handleSubmit}>
        <div className="sign-up-title">SIGN UP</div>
        <label>
          <div>Username:</div>
          <input required minlength={3} maxLength={20} type='text' name="username" 
            className="sign-up-input" value={data.username} onChange={handleChange}>
          </input>
        </label>
        <label>
          <div>Password:</div>
          <input required minlength="6" type='password' name="password" 
            className="sign-up-input" value={data.password} onChange={handleChange}>
          </input>
        </label>
        <label>
          <div>Confirm Password:</div>
          <input required minlength="6" type='password' name="confirmPassword" 
            className="sign-up-input" value={data.confirmPassword} onChange={handleChange}>
          </input>
        </label>
        <div className="sign-up-submit"><button type="submit">Submit</button></div>
      </form>
    </div>
  )
}