import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import './App.css';
import Header from "./components/Header";
import SignUp from './components/users/SignUp.js'
import LogIn from './components/users/LogIn.js'
import MainPage from './components/MainPage'
import Footer from "./components/Footer";
import cookies from 'js-cookie'
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
        setCurrentUser({username: 'Guest', userMessages: []})
        cookies.remove('username')
        cookies.remove('userMessages')
        cookies.remove('userid')
        return navigate('/')
      })
    }
    c()
  }, [])
}

export default App;


