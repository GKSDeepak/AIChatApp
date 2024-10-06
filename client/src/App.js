import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
// import { FaRegCopy } from "react-icons/fa";
// import Text from './components/Text';
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Loginnew from "./pages/Loginnew";
import './App.css';

const App = () => {

  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Chat/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Loginnew/>} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
