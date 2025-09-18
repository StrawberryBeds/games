import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../firebase';
import './Header.css'
// import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

import SignOutButton from './SignOutButton.jsx';

function Header () {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/signup');
        navigate('/signin');
        navigate('/');
    }

//   const { currentUser } = useAuth();

    return (
        <header className="header">
            <h2>Create an account to play with family and friends.</h2>
            <button onClick={() => navigate('/signup')}>Create Your Account</button>
            <button onClick={() => navigate('/signin')}>Sign In</button>
            <SignOutButton />
        </header>
    );
}

export default Header;

// // src/pages/HomePage.jsx
// import { useNavigate } from 'react-router-dom';

// function HomePage() {
//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     navigate('/about');
//   };

//   return (
//     <div>
//       <h1>Welcome to the Home Page!</h1>
//       <button onClick={handleNavigate}>Go to About Page</button>
//     </div>
//   );
// }

// export default HomePage;