import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const { currentUser } = useSelector((state) => {
    return state.user
  })
  return (
    <header>
        <Link to="/">Auth Tutorial</Link>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            {
              currentUser.name ? (
                <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
                </>
              ) : (
                <>
                <li><Link to="/profile" title='Profile'><img src={currentUser.photo} alt="" /></Link></li>
                </>
              )
            }
        </ul>
    </header>
  )
}

export default Navbar