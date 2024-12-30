import React from 'react'
import RegisterPage from './components/RegistrationPage'
import LoginPage from './components/LoginPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/dashboard' element={<DashboardPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App