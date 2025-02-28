import React from 'react'
import {useNavigate, Link} from "react-router-dom"
import { useState } from 'react'
import "./LoginForm.css"

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try{
            alert("login successful!")
            navigate("/process")
        }
        catch (error){
            alert("errorrr!!!!")
        }
    }

    return (
        <div className="container">
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
                 <p ><Link to='/register' className='link'>Need an account? Register </Link></p>
            </div>
            <div className="img-container">
                <img src="https://s3-alpha-sig.figma.com/img/cfa8/0ce8/c4900a6038da878fcb345e53ceda53a4?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=C8GcvTxQ6NSl-mLUGdjdg6~FACoC1bKQX4FNffMiJ5TVQh1H4y~CvQZ4XNg2OEP5wj4O1geFNZUIRC8pBJDcVVKFTXTChpVwD1KOOYDZV3qqu0HqY5bq9OKFsMx6RddFfAlr9q5UfTsqaAxfOn-UHTcbDBCkBy7zbApBsPbq0LMHA2lWEiMCcK4Jpz9MbeibcmjW9KNR7IEIQFSYMkXvonvoQYlf-w7ZOpLsw9exI-Adl~YJhYzvfL1GHoNDmJPKt3liaWd~cUIrrDN5yHk4Pa30Cp7Kww8M3c3xkVHgEhlSHfIZ7OMm0SdIG4wrVViqbTlA3bRS3OEG3-p4mwGgxQ__" alt="store" />
            </div>
        </div>
    )
}

export default LoginForm
