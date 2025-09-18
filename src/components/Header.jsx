
import './Header.css'
import { useNavigate } from 'react-router-dom';

import SignOutButton from './SignOutButton.jsx';

function Header () {
    const navigate = useNavigate();


    return (
        <header className="header">
            <h2>Create an account to play with family and friends.</h2>
            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={() => navigate('/signup')}>Create Your Account</button>
            <button onClick={() => navigate('/signin')}>Sign In</button>
            <SignOutButton />
        </header>
    );
}

export default Header;