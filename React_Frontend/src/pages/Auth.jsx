import React from 'react'
import { Outlet } from 'react-router-dom'
import "../CSS/Auth.css"

export default function Auth() {
  return (
    <div className='container'>
        <Outlet/>
        <div className="img-container">
            <img src="/auth_image.jpg" alt="store" />
        </div>
    </div>
  )
}
