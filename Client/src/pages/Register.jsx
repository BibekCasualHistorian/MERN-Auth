import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
Link

const Register = () => {

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [mobile, setMobile] = useState()
    const [password, setPassword] = useState()

    const [error, setError] = useState(false)
    

    const handleSubmit = async(e) => {
        e.preventDefault()
        const response = await fetch("http://localhost:3000/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, email, mobile, password
            })
        })

        console.log("response", response)

        const data = await response.json()
        console.log("data", data)
        if(response.ok) {
            setError(false)
            console.log("succes")
        }
        else {
            setError(data.error)
            console.log("failed")
        }
    }

  return (
    <>
    <Navbar />
    <div className='form-register'>
        Register: 
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username: </label> <br />
            <input type="text" id='username' name='username' autoComplete='no' required value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="email">Email: </label> <br />
            <input type="email" id='email' name='email' autoComplete='no' required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="mobile">Mobile: </label> <br />
            <input type="text" id='mobile' name='mobile' autoComplete='no' required value={mobile} onChange={(e) => setMobile(e.target.value)} />
            <label htmlFor="password">Password: </label> <br />
            <input type="text" id='password' name='password' autoComplete='no' required value={password} onChange={(e) => setPassword(e.target.value)} />
            <h2>{error ? <p style={{color: "red", fontSize: "1.2rem"}}>{error}</p> : "" }</h2>
            <input type="submit" value="Register" className='form-submit' />
        </form>
        <p>Have a account <Link to="/login">Login</Link></p>
    </div>
    </>
  )
}

export default Register