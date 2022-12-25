import React from 'react'
import './SearchStyle.css'
import {FiSearch} from 'react-icons/fi'
import {BsThreeDotsVertical} from 'react-icons/bs'

const Serachbar = () => {
  return (
    <div className='serach-box'>
      <input className='search' type="text" placeholder='Search' />
      <FiSearch className='search-icon'/>
      <BsThreeDotsVertical className='dot-icon'/>
    </div>
  )
}

export default Serachbar