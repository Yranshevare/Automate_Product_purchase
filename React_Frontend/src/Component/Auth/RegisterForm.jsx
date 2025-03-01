import React from 'react'
import {useNavigate, Link} from "react-router-dom"
import { useState } from 'react'
import {server} from "../../constant.js"
import axios from "axios"
import "../../CSS/RegisterForm.css"

function RegisterForm() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone , setPhone] = useState("")
    const [occupation , setOccupation] = useState("")
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [registerLoading, setRegisterLoading] = useState("REGISTER")
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log(name, email, phone, occupation, gender, password, confirmPassword)
        if(password.length < 8){
            alert("password must be at least 8 characters long!")
            return
        }
        if(password !== confirmPassword){
            alert("passwords do not match!")
            return;
        }
        try{
            setRegisterLoading("Registering...")
            const res = await axios.post(`${server}auth/registerUser/`,{
                username: name,
                email: email, 
                mobileNo: phone, 
                proffesion: occupation, 
                gender: gender, 
                password: password, 
            }, {
                withCredentials: true
            })
            console.log(res)
            await navigate("/auth/login")
        }
        catch(error){
            console.log(error.response?.data?.error)
            alert( error.response?.data?.error)
        }
        finally{
            setRegisterLoading("REGISTER")
        }
    }

    return (
        <>
            <div className="register-form-container">
                <h2 className="title">Register</h2>
                <form 
                className="register-form"
                onSubmit={handleRegister}>
                    <div className="register-form-group">
                        <input type="text" className="input" placeholder='Name' onChange={(e)=>setName(e.target.value)} required/>
                        <input type="Email" className="input" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} required />
                        <input type="phone" className="input" placeholder='Phone Number' onChange={(e)=>setPhone(e.target.value)} maxLength="10" minLength="10" required />
                        <input type="text" className="input" placeholder='Occupation' onChange={(e)=>setOccupation(e.target.value)} required />
                        <div className="gender-container">
                            <label>Gender</label>
                            <div className='radio'>
                                <label>
                                    <input type="radio" value="Male" checked={gender === "Male"} onChange={(e) => setGender(e.target.value)} required />
                                    Male
                                </label>
                                <label>
                                    <input type="radio" value="Female" checked={gender === "Female"} onChange={(e) => setGender(e.target.value)} required />
                                    Female
                                </label>
                                <label>
                                    <input type="radio" value="Other" checked={gender === "Other"} onChange={(e) => setGender(e.target.value)} required />
                                    Other
                                </label>
                            </div>
                        </div>
                        <input type="password" className="input" placeholder='password' onChange={(e)=>setPassword(e.target.value)} required />
                        <input type="password" className="input" placeholder='confirm password' onChange={(e)=>setConfirmPassword(e.target.value)} required/>
                    </div>
                    <button className="button button-primary" type="submit">{registerLoading}</button>
                    {/* <button className="button button-ghost"
                    onClick={()=>{
                        Navigate("/verify")
                    }}>
                        Already have an account? Login
                    </button> */}
                </form>
                <Link to="/auth/login">Already have an account? Login</Link>
            </div>
           
        </>
    )
}

export default RegisterForm
