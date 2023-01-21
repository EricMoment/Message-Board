import React from "react";
import './ErrorPage.css'

export default function ErrorPage() {
  return (
    <div className="error-page">
      The page does not exist.
      <a className="error-page-return" href="/">Return to Main Page</a>
    </div>
  )
}