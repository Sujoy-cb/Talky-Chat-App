import React,{ useEffect, useState } from 'react'
import { Button,Alert } from '@mui/material'
import { getDatabase, ref, set, onValue,push, remove} from "firebase/database";
import {BsThreeDotsVertical} from 'react-icons/bs'
import { getAuth } from 'firebase/auth';
import './FriendReqStyle.css'

const FriendReq = () => {
    const auth = getAuth();
    const db = getDatabase();
    let [friendRequest, setFriendRequest] = useState([])
    let [reqAccept, setReqAccept] = useState (true)

    useEffect(()=>{
        let friendRequestArr = []
        const friendRequestRef = ref(db, 'friendrequest/' );
        onValue(friendRequestRef, (snapshot) => {
        snapshot.forEach((item)=>{
            if(item.val().receiverid == auth.currentUser.uid){
                friendRequestArr.push({
                    id: item.key,
                    sendername: item.val().sendername,
                    senderid: item.val().senderid,
                    receiverid: item.val().receiverid,
                    receivername: item.val().receivername,
                })
            }   
        })
        setFriendRequest(friendRequestArr)
        });
    },[reqAccept])

    let handleAccept= (friend)=>{
        set(push(ref(db, 'friends')), {
            id: friend.id,
            sendername: friend.sendername,
            senderid: friend.senderid,
            receivername: friend.receivername,
            receiverid: friend.receiverid,
            date: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
          }).then(()=>{
            remove(ref(db, 'friendrequest/' +  friend.id))
          }).then(()=>{
            setReqAccept(!reqAccept)
          })
    }

  return (
    <div className='friends-part'>
        <div className="head-part">
            <h4>Friend  Request</h4>
            <BsThreeDotsVertical className='dot-icon'/>
        </div>
        {friendRequest.map(item=>(
            <div className="friends-items">
            <div className="img">
                <img src="./images/friends.png" alt="" />
            </div>
            <div className="name">
                <h5>{item.sendername}</h5>
                <p>Hi Guys, What's up!</p>
            </div>
            <div className="button">
                <Button className='btn' onClick={()=>handleAccept(item)}>Accept</Button>
            </div>
        </div>
            
        ))}
        {friendRequest.length == 0  && 
        <Alert severity="info" style={{marginTop: '20px'}}><h3>No requiest available</h3></Alert>
        }
        
    </div>
  )
}

export default FriendReq