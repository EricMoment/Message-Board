import React, { useEffect, useState } from 'react'
import './MainPage.css'
import { Link } from 'react-router-dom'
import { DateTime } from "luxon";
import MessageForm from './MessageForm';

function guestOrUser(msg) {
  if (msg.hasOwnProperty('message_user')) {
    return (
      <Link className='main-page-user-detail' 
      to={'/user/' + msg.message_user.username}>
        {msg.message_user.username}
      </Link>
    )
  } else {
    return (
      <b className='main-page-user-detail'>Guest</b>
    )
  }
}

export default function MainPage({currentUser}) {
  const [allMessages, setAllMessages] = useState([])
  
  useEffect(() => {
    setAllMessages([])
    async function getMsgs() {
      await fetch('http://localhost:5000')
      .then(async response => {
        if (!response.ok) {
          await response.json(response).then(json => {
            return console.log(json)
          })
        } else {
          await response.json(response).then(json => {
            json.sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.timestamp) - new Date(a.timestamp);
            });
            //console.log(json)
            return setAllMessages(json)
          })
        }
      })
    }
    getMsgs()
  }, [])

  const messageMap = allMessages.length === 0 ? 
    'There is no message' : 
    allMessages.map((msg, i) => {
      return (
        <div key={'main-page-message ' + i} className='main-page-message'>
          <div className='main-page-message-date'>{DateTime.fromISO(msg.timestamp).toFormat('ff')}</div>
          <div className='main-page-message-content'>
            {guestOrUser(msg)}{': ' + msg.content}
          </div>
        </div>
      )
    })

  return (
    <div className='main-page'>
      <MessageForm currentUser={currentUser}/>
      <div className='main-page-messages-container'>{messageMap}</div>
    </div>
  )
}