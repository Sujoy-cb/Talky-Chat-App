import React from 'react'
import Searchbar from '../Serachbar/Serachbar'
import GroupRequest from '../Group/GroupRequest'
import FriendReq from '../Friend/FriendReq'

const MiddleLeft = () => {
  return (
    <>
        <Searchbar/>
        <GroupRequest/>
        <FriendReq/>
    </>
  )
}

export default MiddleLeft