import React,{useEffect,useState} from 'react'
import {Alert,Button, Grid} from '@mui/material'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {BiMessageSquareDots} from 'react-icons/bi'
import { getDatabase, ref, set, onValue, push, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux'
import { activeChat } from '../../Slice/activeChatSlice';
import './FriendsListStyle.css'

const FriendsList = (props) => {
    const dispatch = useDispatch()
    const db = getDatabase();
    let auth = getAuth()
    let [friends,setFriends] = useState([])
    // let [blocked,setBlocked] = useState(true)

    useEffect(()=>{
        const friendslistRef = ref(db, 'friends/' );
        onValue(friendslistRef, (snapshot) => {
            let friendListArr = []
            snapshot.forEach((item)=>{
                if(auth.currentUser.uid == item.val().receiverid || auth.currentUser.uid == item.val().senderid){

                    friendListArr.push({...item.val(),key: item.key})
                }
            })
            setFriends(friendListArr)
        });
    },[])

    let handleBlock= (item)=>{
        console.log(item.key)
        auth.currentUser.uid == item.senderid ?
        set(push(ref(db, 'blockfriends')), {
                blockname: item.receivername,
                blockid: item.receiverid,
                blockby: item.sendername,
                blockbyid: item.senderid,
                date: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
              }).then(()=>{
                remove(ref(db, 'friends/'+ item.key ))
              })
              :
              set(push(ref(db, 'blockfriends')), {
                blockname: item.sendername,
                blockid: item.senderid,
                blockby: item.receivername,
                blockbyid: item.receiverid,
                date: `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
              }).then(()=>{
                remove(ref(db, 'friends/'+ item.key ))
              })
    }
    

    let handleActiveChat= (item)=>{
        let userInfo ={}
        if(item.receiverid == auth.currentUser.uid){
            userInfo.status = "singlemsg"
            userInfo.id = item.senderid
            userInfo.name = item.sendername
        }else{
            userInfo.status = "singlemsg"
            userInfo.id = item.receiverid
            userInfo.name = item.receivername
        }
        dispatch(activeChat(userInfo))
    }
    

    
  return (
    <div className='friendsList-part'>
        <div className="head-part">
            <h4>{friends.length > 1 ? "Friends" : "Friend"} ({friends.length})</h4>
            <BsThreeDotsVertical className='dot-icon'/>
        </div>
        {friends.length == 0  && 
        <Alert severity="info" style={{marginTop: '20px'}}><h3>Your friendlist is empty</h3></Alert>
        }
        {friends.map((item,keys)=>(
            <div className="friendsList-items" keys={keys} onClick={()=>handleActiveChat(item)}>
                <Grid item xs={3}>
                    <div className="img">
                        <img src="./images/friends2.png" alt="" />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="name">
                    {auth.currentUser.uid == item.senderid
                        ?
                        <h5>{item.receivername}</h5>
                        :
                        <h5>{item.sendername}</h5>
                    }
                    <p>{item.date}</p>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="button">
                    {props.item == "block"? 
                    <Button className='btn' onClick={()=>handleBlock(item)}>Block</Button>
                    :
                    <button className='btn'>
                        <BiMessageSquareDots/>
                    </button>
                    }
                    </div>
                </Grid>
        </div>
        ))}
    </div>
  )
}

export default FriendsList