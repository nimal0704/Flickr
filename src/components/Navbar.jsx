import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_org.png";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() =>{
    const handleScroll = () => {
      if(window.scrollY > lastScrollY){
        setVisible(false);
      }else{
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);


  },[lastScrollY])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50
                    transition-transform duration-300
                    ${visible?"opacity-100" : "opacity-0 pointer-events-none"}
                    bg-primary/80 backdrop-blur-md
                    border-b border-white/5
                    px-4 sm:px-6 py-3
                    flex items-center justify-between`}>

      {/* Logo */}
      <img src={logo}  alt="logo" className="w-20 h-15" onClick={() => navigate("/")}/>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {user ? (
          // logged in
          <>
            <button
              onClick={() => navigate("/watchlist")}
              className="text-sm text-gray-300
                         hover:text-white transition
                         hidden sm:block"
            >Watchlist</button>

            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-8 h-8 rounded-full border-2 border-white/20"
            />

            <button
              onClick={logout}
              className="text-xs sm:text-sm
                         bg-white/10 hover:bg-white/20
                         text-white px-3 py-1.5
                         rounded-full transition"
            >Sign Out</button>
          </>
        ) : (
          // logged out
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2
                       bg-white text-black
                       px-3 sm:px-4 py-1.5 sm:py-2
                       rounded-full text-xs sm:text-sm
                       font-semibold cursor-pointer
                       hover:bg-gray-100 transition"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="w-4 h-4"
              alt="Google"
            />
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;