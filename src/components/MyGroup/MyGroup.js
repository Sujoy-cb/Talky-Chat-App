import React,{useState,useEffect} from 'react'
import {Grid, Alert, Button, Modal, Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider} from '@mui/material'
import {BsThreeDotsVertical} from 'react-icons/bs'
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { getAuth } from 'firebase/auth';
import './MyGroupStyle.css'

const MyGroup = () => {
    const auth = getAuth();
    const db = getDatabase();

    let [mygroupList, setMyGroupList] = useState([])
    let [groupUserreqList, setGroupUserreqList] = useState([])
    const [open, setOpen] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        boxShadow: 24,
        p: 4,
      };
  

    useEffect(()=>{
        const mygroupsRef = ref(db, 'groups');
        onValue(mygroupsRef, (snapshot) => {
            let myGroupArr = []
            snapshot.forEach(item=>{
                let groupInfo ={
                    adminName: item.val().adminName,
                    adminid: item.val().adminid,
                    groupName: item.val().groupName,
                    groupTagline: item.val().groupTagline,
                    key: item.key
                  }
                  myGroupArr.push(groupInfo)
            })
            setMyGroupList(myGroupArr)
        });
    },[])

    
    const handleOpen = (group) =>{
        setOpen(true);
        const userreqRef = ref(db, 'groupjoinrequest');
        onValue(userreqRef, (snapshot) => {
            let groupUserreqArr = []
            snapshot.forEach(item=>{
                if(item.val().adminid == auth.currentUser.uid && item.val().groupid == group.key){
                    let groupInfo ={
                        adminid: item.val().adminid,
                        groupid: item.val().groupid,
                        userid: item.val().userid,
                        username: item.val().username,
                        userPhoto: item.val().userPhoto,
                        key: item.key
                      }
                      groupUserreqArr.push(groupInfo)
                }
                
            })
            setGroupUserreqList(groupUserreqArr)
        });
    } 
    const handleClose = () => setOpen(false);

    let handleRejectGroupReq = (item)=>{
        remove(ref(db, 'groupjoinrequest/' + item.key))
    }

    let handleGroupApprove= (item)=>{
        set(push(ref(db, 'groupmembers')), {
          adminid: item.adminid,
          groupid: item.groupid,
          userid: item.userid,
          username: item.username,
          userPhoto: item.userPhoto,
          key: item.key
      }).then(()=>{
        remove(ref(db, 'groupjoinrequest/' + item.key))
      })
    }


  return (
    <div className='my-group'>
        <div className="head-part">
            <h4>My Groups</h4>
            <BsThreeDotsVertical className='dot-icon'/>
        </div>
        {mygroupList.map((item)=>(
            item.adminid == auth.currentUser.uid &&
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
                    <div className="button">
                        <Button className='btn' onClick={()=>handleOpen(item)}>View</Button>
                    </div>
                </Grid>
                    <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <Box sx={style}>
                        {groupUserreqList.length <= 0&& 
                        <Alert severity="info" style={{marginTop: '20px'}}><h3>No member is available</h3></Alert>}
                        {groupUserreqList.map(item=>(
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem alignItems="flex-start">
                              <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src={item.userPhoto} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={item.username}
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                      sx={{ display: 'inline' }}
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                      style={{color: '#5F35F5'}}
                                    >
                                      {item.username}
                                    </Typography>
                                    {" — Wants to connect this group"}
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <div className="buttons">
                                <Button onClick={()=>handleGroupApprove(item)}>Approve</Button>
                                <Button onClick={()=>handleRejectGroupReq(item)}>Remove</Button>
                            </div>
                            <Divider variant="inset" component="li" />
                          </List>
                        ))}
                    </Box>
                    </Modal>
            </div>
        ))}
        {mygroupList.length == 0 &&
          <Alert severity="info" style={{marginTop: '20px'}}><h3>My Group list is empty</h3></Alert>
          }
    </div>
  )
}

export default MyGroup