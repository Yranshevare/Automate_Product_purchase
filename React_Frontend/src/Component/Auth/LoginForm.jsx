import React from 'react'
import {useNavigate, Link} from "react-router-dom"
import { useState } from 'react'
import axios from "axios"
import {server} from "../../constant.js"
import "../../CSS/LoginForm.css"

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [login, setLogin] = useState('LOG IN')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLogin("Logging in...")
        try{
            let res = await axios.post(`${server}auth/login/`,{
                username: email,
                password: password
            },{
                withCredentials: true
            })
            console.log(res)
            if(res.status === 200){
                navigate("/")
            }
            
        }
        catch (error){
            alert("error: "+error.response?.data?.message)
        }
        finally{
            setLogin("LOG IN")
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
                        <input type="text" className='input' placeholder='Username \ email' onChange={(e)=> setEmail(e.target.value)} required />
                        <input type="password" className='input' placeholder='Password' onChange={(e)=> setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className='button button-primary'>{login}</button>
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
