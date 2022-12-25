import React, {useState, useEffect } from 'react'
import {BsThreeDotsVertical,BsFillPersonPlusFill,BsPersonCheckFill} from 'react-icons/bs'
import {FaUserFriends} from 'react-icons/fa'
import { getDatabase, ref, set, onValue,push} from "firebase/database";
import { getAuth } from 'firebase/auth';
import './UserListStyle.css'

const UserList = () => {
    const auth = getAuth();
    const db = getDatabase();
    let [userList, setUseList] = useState([])
    let [friendRequest, setFriendRequest] = useState([])
    let [friend, setFriend] = useState([])
    let [sentConfirm,setSentConfirm ] = useState(false)

    useEffect(()=>{
        const userRef= ref(db, 'users/');
        onValue(userRef, (snapshot) => {
            let userArr = []
            snapshot.forEach((item)=>{
                userArr.push({
                    username: item.val().username,
                    email: item.val().email,
                    id: item.key
                })
            })
            setUseList(userArr)
          });
    },[])


    useEffect(()=>{
        let friendArr = []
        const friendRef = ref(db, 'friends/' );
        onValue(friendRef, (snapshot) => {
        snapshot.forEach((item)=>{
            friendArr.push(item.val().receiverid+item.val().senderid)
        })
        setFriend(friendArr)
        });
    },[])

    useEffect(()=>{
        const friendRequestRef = ref(db, 'friendrequest/' );
        onValue(friendRequestRef, (snapshot) => {
            let friendRequestArr = []
        snapshot.forEach((item)=>{
                friendRequestArr.push(item.val().receiverid+item.val().senderid)
        })
        setFriendRequest(friendRequestArr)
        });
    },[sentConfirm])

    

    let handleFriendRequest =(info)=>{
        set(push(ref(db, 'friendrequest')), {
            sendername: auth.currentUser.displayName,
            senderid: auth.currentUser.uid,
            receiverid: info.id,
            receivername: info.username
          });
          setSentConfirm(!sentConfirm)
    }


  return (
    <div className='userList-part'>
        <div className="head-part">
            <h4>User List</h4>
            <BsThreeDotsVertical className='dot-icon'/>
        </div>
        {userList.map((item)=>(
            auth.currentUser.uid !== item.id &&
            <div className="userList-items">
            <div className="img">
                <img src="./images/user.png" alt="" />
            </div>
            <div className="name" style={{width: '150px'}}>
                <h5>{item.username}</h5>
                <p>Today, 8:56pm</p>
            </div>
            {friend.includes(item.id+auth.currentUser.uid) || friend.includes(auth.currentUser.uid+item.id)
            
            ?
            <div className="button">
                <button className='req-acpt'>
                    <FaUserFriends className='acpt'/>
                </button>
            </div>
            :
            friendRequest.includes(item.id+auth.currentUser.uid) || friendRequest.includes(auth.currentUser.uid+item.id)  ?
            <div className="button">
                <button className='req-sent'>
                    <BsPersonCheckFill className='sent'/>
                </button>
            </div>
            :
            <div className="button">
                <button className='btns' onClick={()=>handleFriendRequest(item)}>
                    <BsFillPersonPlusFill className='plus'/>
                </button>
            </div>
            
        }
            
        </div>
        ))}
        
    </div>
  )
}

export default UserList