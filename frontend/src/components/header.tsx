import React, { useState } from 'react'
import { BiBell } from 'react-icons/bi'
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { FaUser } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

// temp user
const user = {
    _id: "sdasda",
    role: "admin"
}

const Header = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const logoutHandler = () =>{
    // smth
  }

  const isTicket = true;
  const ticket = 4;

  return (
    <nav className='header'>
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