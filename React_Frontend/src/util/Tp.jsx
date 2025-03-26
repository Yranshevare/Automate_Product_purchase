import React, { useRef } from 'react'
import "../CSS/App.css"

export default function Tp({printRef}) {
  return (
    <div 
    className='print' ref={printRef}>
      <h1>PDF</h1>
    </div>
  )
}