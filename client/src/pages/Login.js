import React, { useState,useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(email, password);
      console.log(response);
      if(response.data.token){
        
        navigate("/",{replace:true});
        window.location.reload();
        alert(response.data.msg);
      }else{
        alert(response.data.msg);
      }
      
    } catch (error) {
      setMessage('Error: ' + error);
    }
  };
  

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p className='signup'>Don't have an account? <NavLink to='/register'>Register</NavLink> </p>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;

