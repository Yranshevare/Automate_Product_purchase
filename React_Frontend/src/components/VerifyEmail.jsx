import {useNavigate, Link} from "react-router-dom"
import "./VerifyEmail.css"
import { useRef, useState } from 'react'

function VerifyEmail() {

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [error, setEror] = useState("")
    const navigate = useNavigate();

    const refs = useRef([])

    const handleOtpChange = (e, index) => {
        const newOtp = [...otp]
        newOtp[index] = e.target.value;
        setOtp(newOtp)

        if(e.target.value !== "" && index < otp.length-1){
            refs.current[index+1].focus()
        }
        
    }

    const handlesubmit = (e) => {
        e.preventDefault()
        const enterOtp = otp.join("")
        if(enterOtp==="123456"){
            navigate("/process")
        }
        else{
            setEror("Invalid OTP. please try again")
            alert("invalid otp")
            setOtp(["","","","","",""])
            refs.current[0].focus()
        }
    }
    

    return (
        <div className='container'>
            <div className="form-container">
                <h2 className="title">VERIFY YOUR EMAIL</h2>
                <form className="form" onSubmit={handlesubmit}>
                    <div className="otp-container">
                        {[...Array(6)].map((_,i)=>(
                            <input type="text"
                            key={i}
                            value={otp[i]}
                            maxLength={1} 
                            className="otp-input"
                            onChange={(e)=> handleOtpChange(e,i)}
                            autoFocus={i===0}
                            ref={(e)=>{refs.current[i]=e}} />
                        ))}
                    </div>
                    <button type="submit" className="button button-primary" >VERIFY OTP</button>
                </form>
            </div>
            <div className="img-container">
                <img src="https://s3-alpha-sig.figma.com/img/cfa8/0ce8/c4900a6038da878fcb345e53ceda53a4?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=C8GcvTxQ6NSl-mLUGdjdg6~FACoC1bKQX4FNffMiJ5TVQh1H4y~CvQZ4XNg2OEP5wj4O1geFNZUIRC8pBJDcVVKFTXTChpVwD1KOOYDZV3qqu0HqY5bq9OKFsMx6RddFfAlr9q5UfTsqaAxfOn-UHTcbDBCkBy7zbApBsPbq0LMHA2lWEiMCcK4Jpz9MbeibcmjW9KNR7IEIQFSYMkXvonvoQYlf-w7ZOpLsw9exI-Adl~YJhYzvfL1GHoNDmJPKt3liaWd~cUIrrDN5yHk4Pa30Cp7Kww8M3c3xkVHgEhlSHfIZ7OMm0SdIG4wrVViqbTlA3bRS3OEG3-p4mwGgxQ__" alt="" />
            </div>
        </div>
    )
}

export default VerifyEmail
