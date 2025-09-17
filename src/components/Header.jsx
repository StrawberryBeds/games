import './Header.css'
// import createAccountButton from './buttons/createAccount';
import { useNavigate } from 'react-router-dom';

function Header () {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/signup');
    }

    return (
        <header className="header">
            <h2>Create an account to play with family and friends.</h2>
            <button onClick={handleNavigate}>Create Your Account</button>
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