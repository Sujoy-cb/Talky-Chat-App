import React,{useState, useEffect} from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {Alert,Grid} from "@mui/material"
import { useNavigate } from "react-router-dom";
import Left from '../components/Leftpart/Left';
import MiddleLeft from '../components/MiddleLeft/MiddleLeft'
import MiddleRight from '../components/MiddleRight/MiddleRight';
import MyGroup from '../components/MyGroup/MyGroup';
import Right from '../components/Right/Right';
import BlockUser from '../components/BlockUser/BlockUser';


const Home = () => {

  const auth = getAuth();
  let navigate = useNavigate();
  let [emailverify, setEmailverify] = useState('')
  
  useEffect(()=>{
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setEmailverify(user.emailVerified)
        } else {
          navigate('/login')
        }
      });
  },[])

  return (
    <>
        {emailverify?
    
            <Grid container>
              <Grid item xs={2}>
                <Left active="home"/>
              </Grid>
              <Grid item xs={4}>
                <MiddleLeft/>
              </Grid>
              <Grid item xs={3}>
                <MiddleRight/>
                <MyGroup/>
              </Grid>
              <Grid item xs={3}>
                <Right/>
                <BlockUser/>
              </Grid>
            </Grid>
        :
        <Grid container spacing={1}>
          <Grid item lg={3}>
          </Grid>
          <Grid item lg={6}>
            <Alert variant="filled" severity="error" style={{marginTop: '100px', justifyContent: 'center'}}>
                <h5 style={{textAlign: 'center', fontSize: '20px'}}>Check your email for the verification</h5>
            </Alert>
          </Grid>
          <Grid item lg={3}>
          </Grid>
        </Grid>
        }
    </>
  )
}

export default Home