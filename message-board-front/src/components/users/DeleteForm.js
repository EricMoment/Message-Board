import React, { useState } from 'react'
import './DeleteForm.css'
import { useNavigate } from 'react-router-dom'

export default function UpdateForm({currentUser, focusedMsg, setPop, setFocusedMsg}) {
  const [errMessage, setErrMessage] = useState(' ')
  const navigate = useNavigate()

  async function confirmDelete() {
    await fetch('http://localhost:5000/delete-message', {
      method: 'DELETE', //all 3 keys necessary
      body: JSON.stringify({
        message_userid: currentUser.userid,
        message_id: focusedMsg._id
      }),
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

  function cancelDelete() {
    setPop(false)
    setFocusedMsg(null)
  }

  return (
    <>
    <div onClick={cancelDelete} className='black-overlay-delete'></div>
    <div className="user-page-delete-form">
      <div className='user-page-delete-form-confirm'>Are you going to delete the message?</div>
      <div className="user-page-delete-form-err-message">{errMessage}</div>
      <div className='user-page-delete-form-choices'>
        <div onClick={confirmDelete} className='user-page-delete-form-yes'><button>Yes</button></div>
        <div onClick={cancelDelete} className='user-page-delete-form-no'><button>No</button></div>
      </div>
    </div>
    </>
  )
}
