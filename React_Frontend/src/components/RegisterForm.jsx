import React from 'react'
import {useNavigate, Link} from "react-router-dom"
import { useState } from 'react'
import "./RegisterForm.css"

function RegisterForm() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone , setPhone] = useState("")
    const [occupation , setOccupation] = useState("")
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            alert("passwords do not match!")
            return;
        }
        try{
            await navigate("/verify")
        }
        catch(error){
            alert("registration failed!")
        }
    }

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="title">Register</h2>
                <form 
                className="form"
                onSubmit={handleRegister}>
                    <div className="form-group">
                        <input type="text" className="input" placeholder='Name' onChange={(e)=>setName(e.target.value)} required/>
                        <input type="Email" className="input" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} required />
                        <input type="phone" className="input" placeholder='Phone Number' onChange={(e)=>setPhone(e.target.value)} maxLength="10" minLength="10" required />
                        <input type="text" className="input" placeholder='Occupation' onChange={(e)=>setOccupation(e.target.value)} required />
                        <div className="gender-container input">
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
                    <button className="button button-primary" type="submit">REGISTER</button>
                    {/* <button className="button button-ghost"
                    onClick={()=>{
                        Navigate("/verify")
                    }}>
                        Already have an account? Login
                    </button> */}
                </form>
                <p><Link to="/">Already have an account? Login</Link></p>
            </div>
            <div className="img-container">
                <img src="https://s3-alpha-sig.figma.com/img/cfa8/0ce8/c4900a6038da878fcb345e53ceda53a4?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=C8GcvTxQ6NSl-mLUGdjdg6~FACoC1bKQX4FNffMiJ5TVQh1H4y~CvQZ4XNg2OEP5wj4O1geFNZUIRC8pBJDcVVKFTXTChpVwD1KOOYDZV3qqu0HqY5bq9OKFsMx6RddFfAlr9q5UfTsqaAxfOn-UHTcbDBCkBy7zbApBsPbq0LMHA2lWEiMCcK4Jpz9MbeibcmjW9KNR7IEIQFSYMkXvonvoQYlf-w7ZOpLsw9exI-Adl~YJhYzvfL1GHoNDmJPKt3liaWd~cUIrrDN5yHk4Pa30Cp7Kww8M3c3xkVHgEhlSHfIZ7OMm0SdIG4wrVViqbTlA3bRS3OEG3-p4mwGgxQ__" alt="register-img" />
            </div>
        </div>
    )
}

export default RegisterForm
