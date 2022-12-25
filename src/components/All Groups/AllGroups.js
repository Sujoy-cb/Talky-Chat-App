import React,{useState, useEffect} from 'react'
import {Grid, Alert, Button, Modal, Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider} from '@mui/material'
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import {BsThreeDotsVertical} from 'react-icons/bs'
import {BiMessageSquareDots,BiGroup} from 'react-icons/bi'
import { getAuth } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux'
import { activeChat } from '../../Slice/activeChatSlice';

const AllGroups = () => {
    const dispatch = useDispatch()
    const db = getDatabase();
    const auth = getAuth()

    let [groupList, setGroupList] = useState([])
    let [groupMembersList, setGroupMembersList] = useState([])
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    useEffect(()=>{
        let groupArr = []
        const groupsRef = ref(db, 'groups');
        onValue(groupsRef, (snapshot) => {
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
    },[])


    let handleActiveChat= (item)=>{
        let groupInfo ={
            status: "groupmsg",
            name: item.groupName,
            groupid: item.key,
            adminid: item.adminid
        }
        dispatch(activeChat(groupInfo))
    }


    let handleGroupmemberShow= (id)=>{
        handleOpen(true)
        const groupsRef = ref(db, 'groupmembers');
      onValue(groupsRef, (snapshot) => {
          let groupArr = []
          snapshot.forEach(item=>{
              if(id == item.val().groupid){
                let groupMemberinfo ={
                    adminid: item.val().adminid,
                    groupid: item.val().groupid,
                    id: item.key,
                    userid: item.val().userid,
                    username: item.val().username,
                    userPhoto: item.val().userPhoto
                }
                groupArr.push(groupMemberinfo)
              }
            })
            setGroupMembersList(groupArr)
        });
    }

  return (
    <div className='my-group'>
        <div className="head-part">
            <h4>All Groups</h4>
            <BsThreeDotsVertical className='dot-icon'/>
        </div>

        {groupList.map(item=>(
            
              <div className="group-items" onClick={()=>handleActiveChat(item)}>
                <Grid item xs={3}>
                    <div className="img">
                        <img src="./images/avatarr.jpg" alt="" />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="name">
                        <h5>{item.groupName}</h5>
                        <p>{item.groupTagline}</p>
                        <p style={{color: "#3120E0"}}>{item.adminid != auth.currentUser.uid? "" :"You are Admin" }</p>
                    </div>
                </Grid>
                    <Grid item xs={3}>
                        <div className="button">
                            <button className='btn' style={{marginRight: '10px'}}>
                                <BiMessageSquareDots/>
                            </button>
                            <button className='btn' style={{cursor: 'pointer'}} onClick={()=>handleGroupmemberShow(item.key)} >
                                <BiGroup/>
                            </button>
                        </div>
                    </Grid>
            </div>
            
        ))}
         <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <h4>Total member: {groupMembersList.length}</h4>
            {groupMembersList.map(item=>(
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
                    >
                        {item.username}
                    </Typography>
                    {" is a member of this group"}
                    </React.Fragment>
          }
        />
      </ListItem>
            <Divider variant="inset" component="li" />
        </List>
            ))}
        </Box>
      </Modal> 
    </div>
  )
}

export default AllGroups