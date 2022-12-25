import React,{useEffect,useState} from 'react'
import { getAuth, signOut,onAuthStateChanged,updateProfile  } from "firebase/auth";
import { getStorage, ref, uploadString,getDownloadURL  } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import {AiOutlineHome,AiOutlineMessage,AiOutlineSetting,AiFillCamera} from 'react-icons/ai'
import {IoMdNotificationsOutline} from 'react-icons/io'
import {TbLogout} from 'react-icons/tb'
import {Modal,Box,Typography} from '@mui/material'
import {Link} from 'react-router-dom'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import './LeftStyle.css'


const Left = (props) => {
    const auth = getAuth();
    let navigate = useNavigate()
    const storage = getStorage();

    // const defaultSrc = "images/avatarr.jpg";


    const [image, setImage] = useState();
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();
    

    let [userName,setUserName] = useState('')
    let [userEmail,setUserEmail] = useState('')
    let [userId,setUserId] = useState('')
    let [open,setOpen] = useState(false)
    let [open2,setOpen2] = useState(false)
    let [loading,setLoading] = useState(false)
    let [check,setCheck] = useState(false)

    let handleModal= ()=>{
      setOpen(true)
    }
    let handleModal2= ()=>{
      setOpen2(true)
    }
    
    let handleClose =()=>{
      setOpen(false)
    }
    let handleClose2 =()=>{
      setOpen2(false)
    }
    

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserName(user.displayName)
            setUserEmail(user.email)
            setUserId(user.uid)
          } else {
            navigate('/login')
          }
        });
    },[check])

    let handleSignOut= ()=>{
        signOut(auth).then(() => {
            navigate('/login')
          }).catch((error) => {
            console.log(error)
          });
    }


    let handleUploadImage= (e)=>{
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    }


    const getCropData = () => {
      setLoading(true)
      if (typeof cropper !== "undefined") {
        const storageRef = ref(storage, auth.currentUser.uid);
        const message4 = cropper.getCroppedCanvas().toDataURL();
        uploadString(storageRef, message4, 'data_url').then((snapshot) => {
          setLoading(false)
          setOpen2(false)
          getDownloadURL(storageRef).then((url)=>{
            updateProfile(auth.currentUser, {
              photoURL: url
              }).then(() => {
                console.log('uploaded')
                setCheck(!check)
                setImage(false)
              }).catch((error) => {
                console.log(error)
              });
            })
        });
      }
    };




  return (
    <div className='left-part'>
        <div className="profileimg">
          <div className="profileimgbox">
            {!auth.currentUser.photoURL
                  ?
                  <img src="images/avatarr.jpg" alt="" />
                  :
                  <img src={auth.currentUser.photoURL} alt="" />
            }
            <div className="overlay">
              <AiFillCamera onClick={handleModal2}/>
            </div>
          </div>
            <h5 onClick={handleModal}>{userName}</h5>
        </div>
        <div className="icons">
            <ul>
                <li className={props.active == 'home' && 'active'}>
                  <Link to="/home">
                    <AiOutlineHome className='icon'/>
                  </Link>
                    
                </li>
                <li className={props.active == 'msg' && 'active'}>
                  <Link to="/chat">
                    <AiOutlineMessage className='icon'/>
                  </Link>
                </li>
                <li className={props.active == 'notification' && 'active'}>
                    <IoMdNotificationsOutline className='icon'/>
                </li>
                <li className={props.active == 'setting' && 'active'}>
                    <AiOutlineSetting className='icon'/>
                </li>
                <li className='logout' onClick={handleSignOut}>
                    <TbLogout className='icon'/>
                </li>
            </ul>
        </div>

          <Modal
            className='mainModal'
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className='modalbox'>
              <Typography className='modal-header' id="modal-modal-title" variant="h6" component="h2">
                User details
              </Typography>
              <Typography className='user-des' id="modal-modal-description" sx={{ mt: 2 }}>
                <h6>User ID: <span>{userId}</span></h6>
                <h6>Email: <span>{userEmail}</span></h6>
              </Typography>
            </Box>
          </Modal>

        
          <Modal
            className='mainModal'
            open={open2}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className='imgmodalbox'>
              <Typography className='modal-header' id="modal-modal-title" variant="h6" component="h2">
                Upload or Change profile image
              </Typography>
              <div className="demoimg">
                {!auth.currentUser.photoURL
                  ?
                  image
                  ?
                  <div className="img-preview"></div>
                  :
                  <img src="images/avatarr.jpg" alt="" />
                  :
                  image
                  ?
                  <div className="img-preview"></div>
                  :
                  <img src={auth.currentUser.photoURL} alt="" />
                }
              </div>
              
              <input type="file" onChange={handleUploadImage}/>

              <Cropper
                style={{ height: 200, width: "50%",margin: 'auto',marginTop: '20px' }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
              {image ?
                loading?
                <button className='button' disabled>
                  Uploading...
                </button>
                :

              <button className='button' onClick={getCropData}>
                Upload Image
              </button>
              :
              ""

              }

            
              
            </Box>
          </Modal>
    </div>
  )
}

export default Left