import React,{useState,useEffect} from 'react'
import {Button, Grid, Alert} from '@mui/material'
import {BsThreeDotsVertical} from 'react-icons/bs'
import { getDatabase, ref, onValue, set, push, remove} from "firebase/database";
import { getAuth } from 'firebase/auth';
import './BlockUserStyle.css'

const BlockUser = () => {
    const auth = getAuth()
    const db = getDatabase();
    let [blockFriend,setBlockFriend] = useState([])

    useEffect(()=>{
        const blockFriendRef = ref(db, 'blockfriends/');
        onValue(blockFriendRef, (snapshot) => {
        const blockFriendArr = []
        snapshot.forEach((item)=>{
            if(item.val().blockbyid == auth.currentUser.uid){
                blockFriendArr.push({
                    id: item.key,
                    blockname: item.val().blockname,
                    blockid: item.val().blockid,
                })
            }else if(item.val().blockid == auth.currentUser.uid){
                blockFriendArr.push({
                    id: item.key,
                    blockbyname: item.val().blockby,
                    blockbyid: item.val().blockbyid
                })
            }
            
        })
        setBlockFriend(blockFriendArr)
        });
    },[])

    let handleUnblock= (item)=>{
        console.log(item)
        set(push(ref(db, 'friends')), {
            sendername: item.blockname,
            senderid: item.blockid,
            receivername: auth.currentUser.displayName,
            receiverid: auth.currentUser.uid,
            date: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
          }).then(()=>{
            remove(ref(db, 'blockfriends/'))
          })
    }
    

  return (
    <div className='block-user'>
        <div className="head-part">
            <h4>Blocked Users</h4>
            <BsThreeDotsVertical className='dot-icon'/>
        </div>
        {blockFriend.map(item=>(
            <div className="block-items">
            <Grid item xs={3}>
                <div className="img">
                    <img src="./images/user.png" alt="" />
                </div>
            </Grid>
            <Grid item xs={6}>
                <div className="name">
                    <h5>{item.blockname}</h5>
                    <h5>{item.blockbyname}</h5>
                    <p>12/10/2022</p>
                </div>
            </Grid>
            <Grid item xs={3}>
                {item.blockbyid?"":
                <div className="button">
                    <Button className='btn' onClick={()=>handleUnblock(item)}>Unblock</Button>
                </div>
                }
            </Grid>
            </div>
        ))}
        {blockFriend.length == 0 &&
            <Alert severity="info" style={{marginTop: '20px'}}><h3>Block list is empty</h3></Alert>
        }
            
       
    </div>
  )
}

export default BlockUser