import React,{useState,useEffect} from 'react'
import {Button, Modal,Box,Typography,TextField, Grid, Alert} from '@mui/material'
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getAuth } from 'firebase/auth';
import './GroupReStyle.css'

const GroupRequest = () => {
    const auth = getAuth();
    const db = getDatabase();


    let [groupName, setGroupName] = useState("")
    let [groupTagline, setGroupTagline] = useState("")
    let [groupnameErr, setGroupNameErr] = useState('')
    let [grouptaglineErr, setGroupTaglineErr] = useState('')
    let [myGroup,setMyGroup] = useState("")
    let [image,setImage] = useState('')

    let [groupList, setGroupList] = useState([])
    let [groupmemberList, setGroupMemberList] = useState([])


    let [open,setOpen] = useState(false)
    let [check,setCheck] = useState(false)


    let handleOpenModal=()=>{
        setOpen(true)
    }

    let handleClose =()=>{
        setOpen(false)
      }

    let handleCreateGroup=()=>{
        if(!groupName){
            setGroupNameErr('Please add a group name')
        }else if(!groupTagline){
            setGroupTaglineErr('Please add a group name')
            setGroupNameErr('')
        }else{
            set(push(ref(db, 'groups')), {
                groupName: groupName,
                groupTagline: groupTagline,
                adminName: auth.currentUser.displayName,
                adminid: auth.currentUser.uid
            }).then(()=>{
                setOpen(false)
                setCheck(!check)
            })
        } 
        setMyGroup(myGroup)
    }

    useEffect(()=>{
      const groupsRef = ref(db, 'groups');
      onValue(groupsRef, (snapshot) => {
          let groupArr = []
          snapshot.forEach(item=>{
              let groupInfo ={
                adminName: item.val().adminName,
                adminid: item.val().adminid,
                groupName: item.val().groupName,
                groupTagline: item.val().groupTagline,
                key: item.key
              }
                groupArr.push(groupInfo)
            })
            setGroupList(groupArr)
        });
    },[check])


    useEffect(()=>{
      const groupsRef = ref(db, 'groupmembers');
      onValue(groupsRef, (snapshot) => {
          let groupArr = []
          snapshot.forEach(item=>{
              if(item.val().userid == auth.currentUser.uid){
                groupArr.push(item.val().groupid)
              }
            })
            setGroupMemberList(groupArr)
        });
    },[])


    let handleGroupjoinReq =(id,gid,gn,gtl)=>{
      set(push(ref(db, 'groupjoinrequest')), {
        adminid: id,
        groupid: gid,
        groupName: gn,
        groupTagline: gtl,
        userid: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        userPhoto: auth.currentUser.photoURL
    })
      set(push(ref(db, 'notification')), {
        adminid: id,
        groupid: gid,
        groupName: gn,
        groupTagline: gtl,
        userid: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        userPhoto: auth.currentUser.photoURL
    })
    }


  return (
    <div className='group-part'>
        <div className="head-part">
            <h4>Groups List</h4>
            <div className="button">
                <Button className='btn' onClick={handleOpenModal}>Create Group</Button>
            </div>
        </div>

        {groupList.map(item=>(
            item.adminid != auth.currentUser.uid &&
            
              <div className="group-items">
                <Grid item xs={3}>
                  <div className="img">
                    <img src="./images/avatarr.jpg" alt="" />
                  </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="name">
                      <h5>{item.groupName}</h5>
                      <p>{item.groupTagline}</p>
                    </div>
                </Grid>
                <Grid item xs={3}>
                  {groupmemberList.indexOf(item.key) == -1 ?
                  <div className="button">
                  <Button className='btn' onClick={()=>handleGroupjoinReq(item.adminid,item.key,item.groupName,item.groupTagline)}>Join</Button>
              </div>
                  :
                  <div className="button">
                      <Button className='btn'>Joined</Button>
                  </div>
                  }
                  
                  
                </Grid>
            </div>
            
        ))}
        

        <Modal
            className='groupModal'
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className='groupmodalbox'>
              <Typography className='modal-header' id="modal-modal-title" variant="h6" component="h2">
                Create New Group
              </Typography>
              <Typography className='user-des' id="modal-modal-description" sx={{ mt: 2 }}>

              <TextField className='input' 
                fullWidth 
                label="Group Name" 
                id="fullWidth"
                onChange={(e)=>setGroupName(e.target.value)}
                />
                <p>{groupnameErr}</p>

              <TextField className='input' 
                fullWidth 
                label="Group Tagline" 
                id="fullWidth"
                onChange={(e)=>setGroupTagline(e.target.value)} 
                />
                <p>{grouptaglineErr}</p>

                <div className="imagepreview">
                  {!image
                  ?
                  <img src="./images/avatarr.jpg" alt="" />
                  :
                  <img src="./images/avatarr.jpg" alt="" />
                  }
                </div>

              <input type="file" style={{color: '#444'}}/>
              <div className="button">
                <Button className='btn' style={{width: '100%'}} onClick={handleCreateGroup}>Create Group</Button>
            </div>
              </Typography>
            </Box>
          </Modal>
          {groupList.length == 0 &&
          <Alert severity="info" style={{marginTop: '20px'}}><h3>Group list is empty</h3></Alert>
          }
    </div>
  )
}

export default GroupRequest