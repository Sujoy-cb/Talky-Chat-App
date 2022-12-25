import React,{ useState } from 'react'
import {TextField,Button} from '@mui/material'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import './ResetPassStyle.css'

const ResetPass = () => {
    const auth = getAuth()
    const navigate= useNavigate()
    let [email,setEmail] = useState("")

    let handleResetPass= ()=>{
        sendPasswordResetEmail(auth, email)
        .then(() => {
            navigate('/login',{state:{msg:"Check your email to reset password"}})
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
        });
    }
  return (
    <div className="reset-pass">
        <div className="forgot">
            <h2>Reset your password</h2>
            <p>Enter your email below to reset your password. We sent a link to your email to reset your password.</p>
            <TextField 
                className='input' 
                id="outlined-basic" 
                label="Enter email" 
                variant="outlined"
                type="email"
                onChange={(e)=>setEmail(e.target.value)}
            />
            <div className="button">
                    <Button className='sub-button' variant="contained" onClick={handleResetPass} >Reset Password</Button>
                </div>
        </div>
    </div>
  )
}

export default ResetPass