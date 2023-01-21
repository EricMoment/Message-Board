import React, { useState } from 'react'
import './MessageForm.css'
import { useNavigate } from 'react-router-dom'

export default function MessageForm({currentUser}) {
  const [messageToPost, setMessageToPost] = useState({
    content: '',
    message_userid: currentUser.userid,
    message_username: currentUser.username
  })
  const [errMessage, setErrMessage] = useState(' ')
  const [textLength, setTextLength] = useState(0)
  const navigate = useNavigate();

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
      } else {
        await response.json(response).then(json => {
          console.log(json)
          navigate(0)
        })
      }
    })
  }

  function handleChange(e) {
    setMessageToPost({...messageToPost, [e.target.name]: e.target.value})
    setTextLength(e.target.value.length)
  }
  return (
    <div className='main-page-form'>
      <form onSubmit={handleSubmit}>
        <textarea name="content" cols="42" rows="6"
          placeholder='Send your message...'
          className="main-page-input"
          required maxLength='150'
          value={messageToPost.content} 
          onChange={handleChange}>
        </textarea>
        <div className='main-page-remaining-char'>Length: {textLength}</div>
        <div className="main-page-submit"><button type="submit">Create Message</button></div>
      </form>
      <div className="main-page-err-message">{errMessage}</div>
    </div>
  )
}