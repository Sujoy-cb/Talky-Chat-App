import React,{useState, useEffect} from 'react'
import {Grid, Modal, Box, Typography, Button, LinearProgress, Alert } from "@mui/material"
import {BsThreeDotsVertical} from 'react-icons/bs'
import {BiSmile} from 'react-icons/bi'
import {FiSend} from 'react-icons/fi'
import {AiOutlineCamera} from 'react-icons/ai'
import moment from 'moment/moment'
import { useSelector, useDispatch } from 'react-redux'
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getAuth } from 'firebase/auth'
import { getStorage, ref as imageref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './MessageStyle.css'

const Message = () => {
    const db = getDatabase();
    const auth = getAuth()
    const storage = getStorage();
    const user = useSelector((state) => state.activeChat.active)


    console.log(user)


    let [msgBox,setMsgBox] = useState('')
    let [msgList,setMsgList] = useState([])
    const [open, setOpen] = useState(false);
    let [file, setFile] = useState(null)
    let [image, setImage] = useState("")
    let [progress, setProgress] = useState(null)

    let [joinedGroup,setJoinedGroup] = useState(true)


    let handleMsgsent=()=>{
        if(msgBox != ""){
            if(user.status == "groupmsg"){
                console.log("It's get from groupmsg")
            }else{
                set(push(ref(db, 'singlemsg/')), {
                    msg: msgBox,
                    whosendid: auth.currentUser.uid,
                    whosendname: auth.currentUser.displayName,
                    whoreceiveid: user.id,
                    whoreceivename: user.name,
                    date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                  }).then(()=>{
                    setMsgBox('')
                })

            }
        }
    }


    useEffect(()=>{
        onValue(ref(db, 'singlemsg/'), (snapshot) => {
            const msgListArr = []
            snapshot.forEach((item)=>{
                if(item.val().whosendid == auth.currentUser.uid && item.val().whoreceiveid == user.id || item.val().whosendid == user.id && item.val().whoreceiveid == auth.currentUser.uid)
                    msgListArr.push(item.val())
                
            })
            setMsgList(msgListArr)
        });
    },[user.id])

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let handleImagesent = (e)=>{
        setFile(e.target.files[0])
    }

    let handleImagesend = ()=>{
        console.log("Image sent")
        const singleImageRef = imageref(storage, 'singleimages/' + file.name);
        const uploadTask = uploadBytesResumable(singleImageRef, file);

        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done')
            setProgress(progress)
            
        }, 
        (error) => {
            console.log(error)
        }, 
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
                if(file != ""){
                    if(user.status == "groupmsg"){
                        console.log("It's get from groupmsg")
                    }else{
                        set(push(ref(db, 'singlemsg/')), {
                            img: downloadURL,
                            whosendid: auth.currentUser.uid,
                            whosendname: auth.currentUser.displayName,
                            whoreceiveid: user.id,
                            whoreceivename: user.name,
                            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                        }).then(()=>{
                            setOpen(false)
                            setProgress(null)
                        })
        
                    }
                }
            });
        }
        );
    }


    useEffect(()=>{
        if(user.status == "groupmsg"){
            const groupMembersRef = ref(db, 'groupmembers');
            onValue(groupMembersRef, (snapshot) => {
            snapshot.forEach((item)=>{
                if(auth.currentUser.uid == item.val().userid && item.val().groupid == user.groupid){
                    setJoinedGroup(user.groupid)
                }
            })
            });
        }
    },[user])
    

  return (
    <div className="message">
        <div className="top">
            <Grid container>
                <Grid item xs={2}>
                    <div className="img">
                        <img src="./images/friends.png" alt="friends" />
                        <div className="online"></div>
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <div className="name">
                        <h3>{user.name}</h3>
                        <h6>Online</h6>
                    </div>
                </Grid>
                <Grid item xs={2}>
                    <div className="dotIcon">
                        <BsThreeDotsVertical className='dot-icon'/>
                    </div>
                </Grid>
            </Grid>
        </div>
        <div className="message-body">
            {msgList.map((item)=>(
                item.whosendid == auth.currentUser.uid?
                item.msg?
            <div className="msg" style={rightAlign}>
                <h6 style={sentMsg}>{item.msg}</h6>
                <p>{moment(item.date, "YYYYMMDD, h:mm").fromNow()}</p>
            </div>
            :
            <div className="msg right" style={rightAlign}>
                <div className="img" style={sentMsg}>
                    <img src={item.img} alt="" />
                </div>
                <p>{moment(item.date, "YYYYMMDD, h:mm").fromNow()}</p>
            </div>
            :
            item.msg?
            <div className="msg" style={leftAlign}>
                <h6 style={rcvMsg}>{item.msg}</h6>
                <p>{moment(item.date, "YYYYMMDD, h:mm").fromNow()}</p>
            </div>
            :
            <div className="msg" style={leftAlign}>
                <div style={rcvMsg} className="img">
                    <img src={item.img} alt="" />
                </div>
                <p>{moment(item.date, "YYYYMMDD, h:mm").fromNow()}</p>
            </div>
            ))}
        </div>
        {user.status == "groupmsg" ?
        user.groupid == joinedGroup || auth.currentUser.uid == user.adminid ?
            <div className="messageBox">
            <input type="text" placeholder='Type your message' 
            onChange={(e)=>setMsgBox(e.target.value)} value={msgBox}/>
            <div className="button">
                <button className='msg-sent'>
                    <FiSend className='send' onClick={handleMsgsent}/>
                </button>
            </div>
            <div className="smileIcon">
                <BiSmile className='smile'/>
            </div>
            <div className="camera-icon" onClick={handleOpen}>
            <AiOutlineCamera/>
            </div>
        </div>
            :
            <Alert severity="warning"><h4>You are not in {user.name} group</h4></Alert>
            
        :
            <div className="messageBox">
            <input type="text" placeholder='Type your message' 
            onChange={(e)=>setMsgBox(e.target.value)} value={msgBox}/>
            <div className="button">
                <button className='msg-sent'>
                    <FiSend className='send' onClick={handleMsgsent}/>
                </button>
            </div>
            <div className="smileIcon">
                <BiSmile className='smile'/>
            </div>
            <div className="camera-icon" onClick={handleOpen}>
            <AiOutlineCamera/>
            </div>
        </div>
        }
        
        
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <input type="file" onChange={handleImagesent}/>
                {progress && 
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress variant="determinate" value={progress} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary"> {progress}%</Typography>
                    </Box>
                  </Box>
                }
                </Typography>
                    <Button className='sentbtn' onClick={handleImagesend}>Send</Button>
            </Box>
        </Modal>
    </div>
  )
}

let rcvMsg ={
    background: '#F1F1F1'
}
let sentMsg ={
    background: '#5F35F5',
    color: '#fff'
}
let leftAlign ={
    justifyContent: 'flex-start'
}
let rightAlign ={
    justifyContent: 'flex-end'
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
  };

export default Message