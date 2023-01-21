import React, { useEffect, useState } from 'react'
import './UserPage.css'
import { DateTime } from 'luxon'
import { useParams } from 'react-router-dom'
import UpdateForm from './UpdateForm'
import DeleteForm from './DeleteForm'
import NoUserPage from './NoUserPage'

export default function UserPage({currentUser}) {
  let { username } = useParams()
  const [userExist, setUserExist] = useState(true)
  const [userAllMessages, setUserAllMessages] = useState([])
  const [popEdit, setPopEdit] = useState(false)
  const [popDelete, setPopDelete] = useState(false)
  const [focusedMsg, setFocusedMsg] = useState(null) //_id: , content: 
  useEffect(() => {
    document.title = 'User | Message Board'
    async function getUserMsgs() {
      await fetch(`http://localhost:5000/user/` + username)
      .then(async response => {
        if (!response.ok) {
          await response.json(response).then(json => { 
            setUserExist(false)
            return console.log(json) 
          })
        } else {
          await response.json(response).then(json => {
            let sortedArr = json.user_messages.sort(function(a,b){
              return new Date(b.timestamp) - new Date(a.timestamp);
            });
            console.log(sortedArr)
            return setUserAllMessages(sortedArr)
          })
        }
      })
    }
    getUserMsgs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function handleUpdateClick(e) {
    //console.log({_id: e.target.id, content: e.target.value})
    setFocusedMsg({_id: e.target.id, content: e.target.value})
    setPopEdit(true)
  }
  function handleDeleteClick(e) {
    setFocusedMsg({_id: e.target.id, content: e.target.value})
    setPopDelete(true)
  }
  const messageMap = userAllMessages.length === 0 ? 
    'There is no message from ' + username : 
    userAllMessages.map((msg, i) => {
      return (
        <div key={'user-page-message ' + i} className='user-page-message'>
          <div className='user-page-message-stat'>
            <div className='user-page-message-date'>
              {DateTime.fromISO(msg.timestamp).toFormat('ff')}
            </div>
          {username !== currentUser.username? <></> : 
            <div className='user-page-edit'>
              <button className='user-page-update' id={msg._id} value={msg.content} onClick={handleUpdateClick}>Update</button>
              <button className='user-page-delete' id={msg._id} value={msg.content} onClick={handleDeleteClick}>Delete</button>
            </div>
          }
          </div>
          <div className='user-page-message-content'>
            {msg.content}
          </div>
        </div>
      )
    })
  if (!userExist) {
    return (<NoUserPage />)
  } else {
    return (
      <div className='user-page'>
        <div className='user-page-name'>{username}{"'s messages"}</div>
        <div className='user-page-messages-container'>{messageMap}</div>
        {popEdit? <UpdateForm currentUser={currentUser} focusedMsg={focusedMsg} setPop={setPopEdit} setFocusedMsg={setFocusedMsg}/> : <></>}
        {popDelete? <DeleteForm currentUser={currentUser} focusedMsg={focusedMsg} setPop={setPopDelete} setFocusedMsg={setFocusedMsg}/> : <></>}
      </div>
    )
  }
}