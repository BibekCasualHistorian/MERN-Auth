import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginError, loginFinish, loginStart } from '../store';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {loading, error} = useSelector((state) => {
    console.log("states collection", state)
    return state.user
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        dispatch(loginStart())
        const response = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });
      
          console.log('response', response);
      
          const data = await response.json();
          console.log('data', data);
              
          if (response.ok) {
            dispatch(loginFinish(data))
            navigate('/');
            console.log('succes');
        } else {
            dispatch(loginError(data.error))
            console.log('failed');
        }
        
    } catch (error) {
        console.log("error", error)
        dispatch(loginError(error.message))
    }

  };

  return (
    <>
      <Navbar />
      <div className='form-register'>
        Login:
        <form onSubmit={handleSubmit}>
          <label htmlFor='email'>Email: </label>
          <br />
          <input
            type='email'
            id='email'
            name='email'
            autoComplete='no'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor='password'>Password: </label>
          <br />
          <input
            type='text'
            id='password'
            name='password'
            autoComplete='no'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <h2>
            {error ? <p style={{ color: 'red', fontSize: '1.2rem' }}>{error}</p> : ''}
          </h2>
          <input type='submit' value='Login' className='form-submit' />
        </form>
        <p>Don't have a account? <Link to='/register'>Register</Link></p>
      </div>
    </>
  );
};

export default Login;
