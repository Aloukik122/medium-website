import React from 'react'
import Navbar from './components/navbar.components'
import {Routes, Route} from 'react-router-dom'
import UserAuthForm from './pages/userAuthForm.pages'


function App() {
  return (

    <Routes>
      <Route path='/' element={<Navbar/>}> 
        <Route path='/signin' element={<UserAuthForm type={'sign-in'}/>}/>
        <Route path='/signup' element={<UserAuthForm type={'sign-up'}/>}/>
      </Route>
    </Routes>

    
  )
}

export default App