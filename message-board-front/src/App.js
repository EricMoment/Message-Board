import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import './App.css';
import Header from "./components/headfooter/Header";
import SignUp from './components/users/SignUp.js'
import LogIn from './components/users/LogIn.js'
import MainPage from './components/MainPage'
import UserPage from "./components/users/UserPage";
import Footer from "./components/headfooter/Footer";
import cookies from 'js-cookie'
import ErrorPage from './components/headfooter/ErrorPage'
//reactJS

function App() {
  const [user, setUser] = useState({
    userid: cookies.get('userid') || undefined,
    username: cookies.get('username') || 'Guest', 
    userMessages: cookies.get('userMessages') || undefined
  })
  return (
    <BrowserRouter>
      <Header currentUser={user} />
        <Routes>
          <Route exact path="/" element={<MainPage currentUser={user} />} />
          <Route path="/user/sign-up" element={<SignUp currentUser={user}/>} />
          <Route path="/user/log-in" element={<LogIn currentUser={user} setCurrentUser={setUser}/>} />
          <Route path="/user/log-out" element={<LogOut currentUser={user} setCurrentUser={setUser}/>} />
          <Route path="/user/:username" element={<UserPage currentUser={user}/>} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      <Footer />
    </BrowserRouter>
  );
}

function LogOut({currentUser, setCurrentUser}) {
  const navigate = useNavigate()
  useEffect(() => {
    if (currentUser.username === 'Guest') { return navigate('/') }
    async function c() {
      await fetch('http://localhost:5000/user/log-out', {credentials: 'include'})
      .then(async response => {
        if (!response.ok) {
          await response.json(response).then(json => console.log(json))
          return navigate('/');
        }
        await response.json(response).then(json => console.log(json))
        setCurrentUser({userid: undefined, username: 'Guest', userMessages: undefined})
        cookies.remove('username')
        cookies.remove('userMessages')
        cookies.remove('userid')
        return navigate('/')
      })
    }
    c()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default App;


