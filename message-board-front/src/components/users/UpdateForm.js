import React, { useState } from 'react'
import './UpdateForm.css'
import { useNavigate } from 'react-router-dom'

export default function UpdateForm({currentUser, focusedMsg, setPop, setFocusedMsg}) {
  const [messageToPut, setMessageToPut] = useState({
    content: focusedMsg.content || '',
    message_userid: currentUser.userid,
    message_id: focusedMsg._id || ''
  })
  const [errMessage, setErrMessage] = useState(' ')
  const [textLength, setTextLength] = useState(focusedMsg.content.length)
  const navigate = useNavigate()
  async function handleUpdate(e) {
    e.preventDefault();
    await fetch('http://localhost:5000/update-message', {
      method: 'PUT', //all 3 keys necessary
      body: JSON.stringify(messageToPut),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    }).then(async response => {
      if (!response.ok) {
        await response.json(response).then(json => {
          return setErrMessage(json)
        })
      } else {
        await response.json(response).then(json => {
          console.log(json)
          return navigate(0)
        })
      }
    })
  }

  function handleChange(e) {
    setMessageToPut({...messageToPut, [e.target.name]: e.target.value})
    setTextLength(e.target.value.length)
  }
  function cancelUpdate() {
    setPop(false)
    setFocusedMsg(null)
  }
  return (
    <>
      <div onClick={cancelUpdate} className='black-overlay-edit'></div>
      <div className="user-page-update-form">
        <form onSubmit={handleUpdate}>
          <textarea
            name="content" cols="30" rows="6"
            placeholder='Update your message...'
            className="user-page-input"
            maxLength='150'
            required
            value={messageToPut.content} 
            onChange={handleChange}>
          </textarea>
          <div className='user-page-remaining-char'>Length: {textLength}</div>
          <div className='user-page-update-form-choices'>
            <div className="user-page-update-form-yes"><button type="submit">Update</button></div>
            <div className='user-page-update-form-no'><button onClick={cancelUpdate}>Cancel</button></div>
          </div>
        </form>
        <div className="user-page-err-message">{errMessage}</div>
      </div>
    </>
  )
}
