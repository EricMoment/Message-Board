import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

export default function Header({currentUser}) {
  function isLoggedin() {
    if (currentUser.username !== 'Guest') {
      return (
        <div className='header-logs'>
          <div className='header-name'>{currentUser.username}</div>
          <Link className='header-links' to='/user/log-out'>Log-out</Link>
        </div>
      )
    } else {
      return (
        <div className='header-logs'>
          <div className='header-name'>{currentUser.username}</div>
          <Link className='header-links' to='/user/sign-up'>Sign-up</Link>
          <Link className='header-links' to='/user/log-in'>Log-in</Link>
        </div>
      )
    }
  }
  return (
    <div className='header'>
      <a className="header-title" href="/">MS Forum</a>
      {isLoggedin()}
    </div>
  )
}