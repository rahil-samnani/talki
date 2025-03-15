import React from 'react'
import logo from '../assets/logo.png'

const AuthLayouts = ({children}) => {
  return (
    <div className='h-screen'>
        <header className='h-1/6 flex justify-center items-center py-3 h-50 shadow-md' style={{backgroundColor : "#3D5088"}}>
            <img 
              src={logo}
              alt='logo'
              width={180}
              height={60}
            />
        </header>

        <div className='h-4/6 flex justify-center items-center'>
          {children}
        </div>
    </div>
  )
}

export default AuthLayouts
