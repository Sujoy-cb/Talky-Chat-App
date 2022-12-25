import React,{useState,useEffect} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login"
import Home from "./pages/Home";
import ResetPass from "./pages/ResetPassword/ResetPass";
import Chat from "./pages/Chat";
import {BrowserRouter,Routes,Route,} from "react-router-dom";
import {BsMoonFill,BsSun} from 'react-icons/bs'

function App() {
  const auth = getAuth()
  let [modeChange,setModeChange] = useState(false)
  let [show,setShow] = useState(false)


  let handleModeChange= ()=>{
    setModeChange(!modeChange)
  }

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setShow(true)
      } else {
        setModeChange(false)
      }
    });
},[])

  
  return (
    <>
    <div className={modeChange? 'dark':'light'}>
    
    {show&&
      <div className="mode" onClick={handleModeChange}>
      {modeChange?
      <>
        <span className="moon-icon"><BsMoonFill /></span>
        <span className="text">Dark mode</span>
      </>
      :
      <>
        <span className="sun-icon"><BsSun /></span>
        <span className="text">Light mode</span>
      </>
      }
    </div>
    }
          <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Registration />}></Route>
                  <Route path="/login" element={<Login />}></Route>
                  <Route path="/home" element={<Home />}></Route>
                  <Route path="/reset" element={<ResetPass />}></Route>
                  <Route path="/chat" element={<Chat />}></Route>
                </Routes>
          </BrowserRouter>
        
    </div>
    </>
  );
}

export default App;
