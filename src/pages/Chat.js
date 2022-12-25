import React from 'react'
import {Alert,Grid} from "@mui/material"
import Left from '../components/Leftpart/Left'
import Searchbar from '../components/Serachbar/Serachbar'
import AllGroups from '../components/All Groups/AllGroups'
import FriendsList from '../components/FriendsList/FriendsList'
import Message from '../components/Message/Message'

const Chat = () => {
   
  return (
    <Grid container>
              <Grid item xs={2}>
                <Left active="msg"/>
              </Grid>
              <Grid item xs={4}>
                <Searchbar/>
                <AllGroups/>
                <FriendsList item="button" />
              </Grid>
              <Grid item xs={6}>
                <Message/>
              </Grid>
            </Grid>
  )
}

export default Chat