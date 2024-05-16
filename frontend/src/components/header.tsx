import React, { useEffect, useState } from 'react'
import { BiBell } from 'react-icons/bi'
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { FaUser } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User } from '../types/types'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import toast from 'react-hot-toast'

// temp user
// const user = {
//     _id: "sdasda",
//     role: "admin"
// }

interface PropsType {
  user: User | null
}

const Header = ({user}: PropsType) => {

  const [active, setActive] = useState(false);
  const { pathname } = useLocation();
  
  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  // we can use "window" and apply js to it as it will not manipulate the dom
  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, [])

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const logoutHandler = async() =>{
    try{
      await signOut(auth)
      toast.success("Signed out")
      setIsOpen(false)
    } catch(err){
      toast.error("Failed to signout")
    }
  }

  const isTicket = true;
  const ticket = 4;

  return (
    <nav className={active || pathname!=="/" ? "header active" : "header"}>
        <Link onClick={()=>setIsOpen(false)} to={"/"}>HOME</Link>
        <Link onClick={()=>setIsOpen(false)} to={"/tickets"} className='redd'><BiBell/><p>({isTicket && ticket})</p></Link>
        <Link onClick={()=>setIsOpen(false)} to={"/search"}><FaSearch/></Link>
        <Link onClick={()=>setIsOpen(false)} to={"/cart"}><FaShoppingBag/></Link>
        {
            user?._id ? (
                <>
                    <button onClick={()=>setIsOpen((prev)=>!prev)}>
                        <FaUser/>
                    </button>
                    <dialog open={isOpen}>
                        <div>
                            {
                                user.role === 'admin' && (
                                    <Link onClick={()=>setIsOpen((prev)=>!prev)} to={"/admin/dashboard"}>Admin</Link>
                                )
                            }
                            <Link onClick={()=>setIsOpen((prev)=>!prev)} to="/orders">Orders</Link>
                            <button onClick={logoutHandler}><FaSignOutAlt/></button>
                        </div>
                    </dialog>
                </> 
            ) : <Link to="/login"><FaSignInAlt/></Link>
        }
    
    </nav>
  )
}

export default Header