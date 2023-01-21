import React from "react";
import './NoUserPage.css'

export default function NoUserPage() {
  return (
    <div className="no-user-page">
      The user does not exist.
      <a className="no-user-page-return" href="/">Return to Main Page</a>
    </div>
  )
}