import React from 'react'
import {useNavigate, Link} from "react-router-dom"
import { useState } from 'react'
import "../../CSS/LoginForm.css"
// import '../CSS/Auth.css'

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try{
            console.log(email, password)
            alert("login successful!")
            navigate("/process")
        }
        catch (error){
            alert("errorrr!!!!")
        }
    }

    return (
        < >
            <div className="form-container">
                <h2 className="title">
                    LOG IN
                </h2>
                <form
                 className="form"
                 onSubmit={handleLogin}>
                    <div className="form-group">
                        <input type="email" className='input' placeholder='Email' onChange={(e)=> setEmail(e.target.value)} required />
                        <input type="password" className='input' placeholder='Password' onChange={(e)=> setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className='button button-primary'>LOG IN</button>
                    {/* <button className='button button-ghost'
                    onClick={()=> navigate("/register")}>
                        Need an account? Register
                    </button> */}
                 </form>
                 <Link to='/auth/register' className='link'>Need an account? Register </Link>
            </div>
            
        </>
    )
}

export default LoginForm
