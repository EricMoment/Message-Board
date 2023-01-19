import React, { useEffect, useState } from 'react'
import './MainPage.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { DateTime } from "luxon";

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
  const [messageToPost, setMessageToPost] = useState({
    content: '',
    message_userid: currentUser.userid,
    message_username: currentUser.username
  })
  const [errMessage, setErrMessage] = useState(' ')
  const [allMessages, setAllMessages] = useState([])
  const [textLength, setTextLength] = useState(0)
  const navigate = useNavigate();
  //todo: useeffect to get all messages

  useEffect(() => {
    setAllMessages([])
    async function getMsgs() {
      await fetch('http://localhost:5000')
      .then(async response => {
        if (!response.ok) {
          await response.json(response).then(json => {
            return setErrMessage(json)
          })
        }
        await response.json(response).then(json => {
          json.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.timestamp) - new Date(b.timestamp);
          });
          console.log(json)
          return setAllMessages(json)
        })
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
            {guestOrUser(msg)}: {msg.content}
          </div>
        </div>
      )
    })
  

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('http://localhost:5000/new-message', {
      method: 'POST', //all 3 keys necessary
      body: JSON.stringify(messageToPost),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    }).then(async response => {
      if (!response.ok) {
        setMessageToPost({ ...messageToPost, content: '' })
        setTextLength(0)
        await response.json(response).then(json => {
          return setErrMessage(json)
        })
      }
      await response.json(response).then(json => {
        console.log(json)
        setMessageToPost({ ...messageToPost, content: '' })
        setTextLength(0)
        navigate(0)
      })
    })
  }

  function handleChange(e) {
    setMessageToPost({...messageToPost, [e.target.name]: e.target.value})
    setTextLength(e.target.value.length)
  }

  return (
    <div className='main-page'>
      <div className='main-page-form'>
        <form onSubmit={handleSubmit}>
          <textarea 
            name="content" cols="60" rows="7"
            placeholder='Send your message...'
            className="main-page-input"
            maxLength='150'
            required
            value={messageToPost.content} 
            onChange={handleChange}>
          </textarea>
          <div className='main-page-remaining-char'>Length: {textLength}</div>
          <div className="main-page-submit"><button type="submit">Create Message</button></div>
        </form>
        <div className="main-page-err-message">{errMessage}</div>
      </div>
      <div className='main-page-messages-container'>{messageMap}</div>
    </div>
  )
}