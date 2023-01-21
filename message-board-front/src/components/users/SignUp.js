import React, { useEffect, useState } from "react";
import './SignUp.css'

import { useNavigate } from "react-router-dom";

export default function SignUp({currentUser}) {
  const [data, setData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errMessageUsername, setErrMessageUsername] = useState(' ')
  const [errMessagePassword, setErrMessagePassword] = useState(' ')
  const [errMessageConfirm, setErrMessageConfirm] = useState(' ')
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser.username !== 'Guest') return navigate('/')
    document.title = 'Sign Up | Message Board'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e) { //post
    e.preventDefault();
    setErrMessageUsername(' ')
    setErrMessagePassword(' ')
    setErrMessageConfirm(' ')
    await fetch('http://localhost:5000/user/sign-up', {
      method: 'POST', //all 3 keys necessary
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    }).then(async response => {
      if (!response.ok) {
        setData({...data, password: '', confirmPassword: ''})
        await response.json(response).then(json =>{
          for (let i = 0; i < json.error.length; i++) {
            if (!json.error[i].param) {
              setErrMessageUsername(json.error)
            } else if (json.error[i].param === 'username') {
              setErrMessageUsername(json.error[i].msg)
            } else if (json.error[i].param === 'password') {
              setErrMessagePassword(json.error[i].msg)
            } else if (json.error[i].param === 'confirmPassword') {
              setErrMessageConfirm(json.error[i].msg)
            }
          }
          return navigate('/user/sign-up')
        })
      } else {
        await response.json(response).then(json => {
          console.log(json)
          navigate('/user/log-in')
        })
      }
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
          <input required minLength={3} maxLength={20} type='text' name="username" 
            className="sign-up-input" value={data.username} onChange={handleChange}>
          </input>
          <div className="sign-up-err-msg">{errMessageUsername}</div>
        </label>
        <label>
          <div>Password:</div>
          <input required minLength={6} type='password' name="password" 
            className="sign-up-input" value={data.password} onChange={handleChange}>
          </input>
          <div className="sign-up-err-msg">{errMessagePassword}</div>
        </label>
        <label>
          <div>Confirm Password:</div>
          <input required minLength={6} type='password' name="confirmPassword" 
            className="sign-up-input" value={data.confirmPassword} onChange={handleChange}>
          </input>
          <div className="sign-up-err-msg">{errMessageConfirm}</div>
        </label>
        <div className="sign-up-submit"><button type="submit">Submit</button></div>
      </form>
    </div>
  )
}