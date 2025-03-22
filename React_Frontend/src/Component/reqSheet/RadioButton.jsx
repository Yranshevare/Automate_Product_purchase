import React from 'react'
import "/src/CSS/ReqSheet.css";

function RadioButton({ label, value, checked, onChange }) {
    
    return (
        <label className='radio-label'>
        <input
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
        />
        {label}
      </label>
    )
}

export default RadioButton
