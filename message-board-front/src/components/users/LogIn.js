import React, { useEffect, useState } from "react";
import './LogIn.css'
import cookies from 'js-cookie'

import { useNavigate } from "react-router-dom";

export default function LogIn({currentUser, setCurrentUser}) {
  const [data, setData] = useState({
    username: '',
    password: '',
  })
  const [errMessage, setErrMessage] = useState(' ')
  const navigate = useNavigate();
  /*You should call navigate() in a React.useEffect(), 
  not when your component is first rendered. (According to Chrome Warning)*/
  useEffect(() => {
    if (currentUser.username !== 'Guest') { return navigate('/') }
    document.title = 'Log In | Message Board'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) //dont remove []

  async function handleSubmit(e) { //post
    e.preventDefault();
    setErrMessage(' ');
    await fetch('http://localhost:5000/user/log-in', {
      method: 'POST', //all 3 keys necessary
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include'
    }).then(async response => {
      if (!response.ok) {
        setErrMessage('Username or Password is wrong.')
        setData({...data, password: ''})
        return navigate('/user/log-in')
      } else {
        //success
        await response.json(response).then(json => {
          //console.log(json)
          cookies.set('userid', json.userid, { expires: 7 })
          cookies.set('username', json.username, { expires: 7 })
          cookies.set('userMessages', json.userMessages, { expires: 7 })
          setCurrentUser({userid: json.userid, username: json.username, userMessages: json.userMessages})
          return navigate('/')
        })
      }
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
          <div className="log-in-err-msg">{errMessage}</div>
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