import React,{useState,useEffect} from 'react'
import {Container,Grid,TextField,Button,Collapse,Alert,IconButton} from '@mui/material'
import {FaEyeSlash,FaEye} from 'react-icons/fa'
import CloseIcon from '@mui/icons-material/Close';
import { Link,useNavigate,useLocation } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";
import './LogStyle.css'

const Login = () => {
    const auth = getAuth();
    let navigate = useNavigate();
    let location = useLocation()
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    let [msg,setMsg] = useState("")
    console.log(location.state)

    let [email,setEmail] = useState("")
    let [password,setPassword] = useState("")
    let [emailErr,setEmailErr] = useState("")
    let [passwordErr,setPasswordErr] = useState("")

    let [usererror,setUsererror] = useState("")
    let [wrongpassworderror,setWrongpassworderror] = useState("")

    
    let [passType,setPassType] = useState(false)


    let handleSubmit =()=>{
        if(!email){
            setEmailErr("Please enter your email")
        }else if(!password){
            setPasswordErr("Please type your password")
            setEmailErr("")
        }else if(password.length<8){
            setPasswordErr("Password must be greater than 8 character")
            setPasswordErr("")
        }else{
            signInWithEmailAndPassword(auth,email,password).then((user)=>{
                navigate('/home')
            }).catch((error)=>{
                const errorCode = error.code;
                if(errorCode.includes('user')){
                    setUsererror("User not found")
                    setOpen(true)
                    setWrongpassworderror('')
                }else if(errorCode.includes('wrong')){
                    setWrongpassworderror('Wrong password')
                    setOpen(true)
                    setUsererror('')
                }
            })
        }
    }

    let handleEye=()=>{
        setPassType(!passType)
    }
    let handleGoogleSignin =()=>{
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            navigate('/home')
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    let handleFbSignin =()=>{
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            navigate('/home')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = FacebookAuthProvider.credentialFromError(error);
        });
    }


    useEffect(()=>{
        if(location.state !== null){
            setMsg(location.state.msg)
            setOpen2(true)
        }
    },[])

  return (
    <div className='log-body'>
        <Container maxWidth="lg">
            <h1 className='app-name'>Talky Chat App</h1>
        <div className="main">
        <Grid className="reg-form" container spacing={2}>
            <Grid item xs={6}>
            <div className="left">
                <div className="inner-left">
                <h2>Login to your account!</h2>
                <div className="extra-login">
                    <div className="log-item" onClick={handleGoogleSignin}>
                        <img src="./images/google.png" alt="" /><p> Login with Google</p>
                    </div>
                    <div className="log-item" onClick={handleFbSignin}>
                        <img src="./images/fb.png" alt="" /><p>Login with Facebook</p>
                    </div>
                </div>
                {usererror || wrongpassworderror 
                ?
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
                            {usererror?usererror:wrongpassworderror && wrongpassworderror}
                            </Alert>
                    </Collapse>
                :
                msg
                ?
                <Collapse in={open2}>
                            <Alert
                            className='email-alert'
                            variant="filled" 
                            severity="success"
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen2(false);
                                }}
                                >
                                <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                            >
                            {msg}
                            </Alert>
                    </Collapse>
                :
                ""
                }
                
                
                <div className="form-field">
                    <TextField className='input' helperText={emailErr} variant="standard" label="Email Address" id="standard-basic" onChange={(e)=>setEmail(e.target.value)}/>
                    <TextField className='input' helperText={passwordErr} variant="standard" type={passType?  'text' : 'password'} label="Type Password" id="standard-basic" onChange={(e)=>setPassword(e.target.value)} />

                        {passType?
                        <FaEye onClick={handleEye} className='icon'/>
                        :
                        <FaEyeSlash onClick={handleEye} className='icon'/>
                        }
                </div>
                <div className="button">
                    <Button className='sub-button' variant="contained" onClick={handleSubmit}>Login to Continue</Button>
                </div>
                    <h6 className='route'>Don’t have an account ? <Link className="link" to="/">Sign up</Link> </h6>
                    <h6 className='route2' > Forgot password?<Link className="link" style={{marginLeft: '5px'}} to="/reset">Click here</Link> </h6>
                
                </div>
            </div>
            </Grid>
            <Grid item xs={6}>
            <div className="right">
                <img src="./images/log-img.png" alt="log-img" />
            </div>
            </Grid>
        </Grid>
        </div>
        </Container>
    </div>
  )
}

export default Login