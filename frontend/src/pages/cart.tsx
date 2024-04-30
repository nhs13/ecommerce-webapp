import React, { useEffect, useState } from 'react'
import { MdOutlineErrorOutline } from 'react-icons/md'
import CartItems from '../components/cart-items'
import { Link } from 'react-router-dom'

const cartItems = [
  {
    productID: "random",
    photo: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/franchise/alienware-laptops/dell-alienware-lt-franchise-cd-1920x1440-x16-mod03-collapsed-1.png?fmt=png-alpha&wid=1920&hei=1440",
    name: "alienware",
    price: 3000,
    quantity: 4,
    stock: 10,

  }
]
const subtotal = 4000
const tax = Math.round(subtotal*0.18)
const shippingCharges = 200
const discount = 400
const total = subtotal + tax + shippingCharges 

const Cart = () => {

  const [couponCode, setCouponCode] = useState<string>("")
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false)

  useEffect(()=>{
    // type karne ke ek sec baad, coupon sahi hai ya nahi batayega
    const timeoutId = setTimeout(()=>{
      if(Math.random() > 0.5){
        setIsValidCouponCode(true)
      } else {
        setIsValidCouponCode(false)
      }
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      setIsValidCouponCode(false)
    }
  }, [couponCode])

  return (
    <div className='cart'>
      <main>
        {
          cartItems.length > 0 ? (
            cartItems.map((i,idx)=>(
              <CartItems key={idx} cartItem={i}/>
            ))
          ) : (<h1>No Items Added</h1>)
        }
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className='red'> - ₹{discount} </em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>

        <input 
          type="text" 
          placeholder='Enter coupoun code'
          value={couponCode}
          onChange={(e)=>setCouponCode(e.target.value)}
        />

        {
          couponCode && (
            isValidCouponCode ? 
          (<span className='green'>₹{discount} of using <code>{couponCode}</code></span>) :
          (<span className='red'>Invalid Coupon <MdOutlineErrorOutline /> </span>)
          )
        }

        {
          cartItems.length > 0 && (
            <Link to={"/shipping"}>Checkout</Link>
          )
        }

      </aside>
    </div>
  )
}

export default Cart