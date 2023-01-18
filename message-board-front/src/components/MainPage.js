import React from 'react'
import { Link } from 'react-router-dom'
import fae from './images/faerielle.png'

export default function MainPage({currentUser}) {

  return (
    <><img src={fae} alt="ilovedher"></img>
    <div>{currentUser.username}</div>
    <Link to='/user/sign-up'>Sign-up</Link>
    <Link to='/user/log-in'>Log-in</Link>
    <Link to='/user/log-out'>Log-out</Link>
    </>
  )
}