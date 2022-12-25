import React, { useState } from 'react'
import {Container,Grid,TextField,Button,Collapse,Alert,IconButton} from '@mui/material'
import { Link,useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword,sendEmailVerification,updateProfile } from "firebase/auth";
import {FaEyeSlash,FaEye} from 'react-icons/fa'
import CloseIcon from '@mui/icons-material/Close';
import { getDatabase, ref, set } from "firebase/database";
import './RegStyle.css'

const Registration = () => {

    const auth = getAuth();
    const db = getDatabase();
    let navigate = useNavigate();

    const [open, setOpen] = useState(false);

    let [userName,setUserName] = useState("")
    let [email,setEmail] = useState("")
    let [password,setPassword] = useState("")
    let [confirmPassword,setConfirmPassword] = useState("")
    let [nameErr,setNameErr] = useState("")
    let [emailErr,setEmailErr] = useState("")
    let [passwordErr,setPasswordErr] = useState("")
    let [confirmPasswordErr,setConfirmPasswordErr] = useState("")
    let [passwordMatchErr,setPasswordMatchErr] = useState("")
    let [existemailerror, setExistemailerror] = useState("")

    let [passType,setPassType] = useState(false)
    let [passType2,setPassType2] = useState(false)


    let handleSubmit =()=>{
        if(!userName){
            setNameErr("Please set a user name")
        }else if(!email){
            setEmailErr("Please enter a valid email")
            setNameErr("")
        }else if(!password){
            setPasswordErr("Please set your password")
            setEmailErr("")
        }else if(password.length<8){
            setPasswordErr("Password must be greater than 8 character")
        }else if(!confirmPassword){
            setConfirmPasswordErr("Please set confirm password")
            setPasswordErr("")
        }else if(password !== confirmPassword){
            setPasswordMatchErr("Password dosen't match")
            setConfirmPasswordErr("")
            
        }else{
            setPasswordMatchErr("")
            createUserWithEmailAndPassword(auth, email, password).then((user)=>{
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        updateProfile(auth.currentUser, {
                            displayName: userName,
                            id: auth.currentUser.uid
                          }).then(() => {
                            set(ref(db, 'users/'+ auth.currentUser.uid), {
                                username: userName,
                                email: email,
                              });
                          }).catch((error) => {
                            console.log(error)
                          });
                    });
                navigate('/login')
            }).catch((error)=>{
                const errorCode = error.code;
                if(errorCode.includes('email')){
                    setExistemailerror("Email already in use. Please try another email.")
                    setOpen(true)
                }
            })
        }
    }


    let handleEye=()=>{
        setPassType(!passType)
    }
    let handleEye2=()=>{
        setPassType2(!passType2)
    }


    
  return (
    <div className='reg-body'>
        <Container maxWidth="lg">
            <h1 className='app-name'>Talky Chat App</h1>
        <div className="main">
        <Grid className="reg-form" container spacing={2}>
            <Grid item xs={6}>
            <div className="left">
                <h2>Get started with easily register</h2>
                <p>Free register and you can enjoy it</p>
                    <Collapse in={open}>
                            <Alert
                            className='email-alert'
                            variant="filled" 
                            severity="error"
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                                >
                                <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                            >
                            {existemailerror}
                            </Alert>
                    </Collapse>
                <div className="form-field">

                <TextField className='input' helperText={nameErr} fullWidth label="User Name" id="fullWidth" onChange={(e)=>setUserName(e.target.value)} />

                <TextField className='input' helperText={emailErr} fullWidth label="Add E-mail" id="fullWidth" onChange={(e)=>setEmail(e.target.value)}/>

                <TextField className='input' helperText={passwordErr} fullWidth type={passType?  'text' : 'password'} label="Type Password" id="fullWidth" onChange={(e)=>setPassword(e.target.value)}/>

                <TextField className='input' helperText={confirmPasswordErr?confirmPasswordErr:passwordMatchErr?passwordMatchErr: ""} fullWidth type={passType2?  'text' : 'password'}label="Confirm Password" id="fullWidth" onChange={(e)=>setConfirmPassword(e.target.value)}/>
                        {passType?
                        <FaEye onClick={handleEye} className='icon'/>
                        :
                        <FaEyeSlash onClick={handleEye} className='icon'/>
                        }

                        {passType2?
                        <FaEye onClick={handleEye2} className='icon2'/>
                        :
                        <FaEyeSlash onClick={handleEye2} className='icon2'/>
                        }
                </div>
                <div className="button">
                    <Button className='sub-button' variant="contained" onClick={handleSubmit}>Sign Up</Button>
                </div>
                <h6 className='route'>Already have an account ? <Link className="link" to="/login">Login</Link> </h6>
            </div>
            </Grid>
            <Grid item xs={6}>
            <div className="right">
                <img src="./images/reg-img.png" alt="reg-img" />
            </div>
            </Grid>
        </Grid>
        </div>
        </Container>
    </div>
  )
}

export default Registration