import {useNavigate, Link, useParams} from "react-router-dom"
import "../../CSS/VerifyEmail.css"
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from "axios"
import { server } from "../../constant"

function VerifyEmail() {
    const {email } = useParams()

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [error, setEror] = useState("")
    const [timer, setTimer] = useState("5:00")
    const [resend, setResend] = useState("Resend otp")
    const [verify, setVerify] = useState("VERIFY OTP")
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

    const handlesubmit = async(e) => {
        e.preventDefault()
        const enterOtp = otp.join("")
        
        try {
            setVerify("Verifying...")
            console.log(enterOtp)
            const res = await axios.get(`${server}auth/verifyOTP/`,{
                params: { otp: enterOtp },
                withCredentials: true
            });
            // console.log(res.data)
            if(res.data.message === 'otp verified successfully'){
                alert("otp verified successfully")
                navigate("/")
            }
        } catch (error) {
            console.log(error)
            setEror("problem while verifying OTP. please try again")
            alert("invalid otp")
            setOtp(["","","","","",""])
            refs.current[0].focus()
        }finally{
            setVerify("VERIFY OTP")
        }
    }
    const sendEmail = useCallback(async () => {
        try {
            
            // console.log(user.email)
            setResend("Resending...")
            const res =await axios.get(`${server}auth/generateOTP/`,{
                withCredentials: true
            })
            if(res.data.message === "otp generated successfully"){
                // navigate(`/auth/verify/${res.data.email || email}`)
                setTimer("5:00")
            }
        } catch (error) {
            console.log(error)
        }finally{
            setResend("Resend otp")
        }
    },[])

    useEffect(() => {
        const interval = setInterval(() => {
            const [minutes, seconds] = timer.split(':');
            const newSeconds = seconds - 1;
            if (newSeconds < 0) {
              const newMinutes = minutes - 1;
              if (newMinutes < 0) {
                clearInterval(interval);
                setTimer('0:00');
              } else {
                setTimer(`${newMinutes}:59`);
              }
            } else {
              setTimer(`${minutes}:${newSeconds < 10 ? `0${newSeconds}` : newSeconds}`);
            }
        }, 1000);
        return () => clearInterval(interval);
         
    },[timer])
    

    return (
        <>
            <div className="form-container">
                <div>
                    <h2 className="title">VERIFY YOUR EMAIL</h2>
                    <p className="otp-message">A 6 digit otp is sent to your email on <b>{email}</b> otp will be valid for only 5 minute</p>
                </div>
                <form className="form" onSubmit={handlesubmit}>
                 
                    <div>
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
                        <div className="otp-timer">{timer}</div>
                    </div>
                    <button type="submit" className="button button-primary" >{verify}</button>
                    <a onClick={sendEmail}>{resend}</a>
                </form>
            </div>
            
        </>
    )
}

export default VerifyEmail
