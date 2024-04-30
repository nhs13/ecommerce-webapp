import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"
import {Toaster, toast} from 'sonner'
import { useEffect } from "react"

const Home = () => {

  const addToCartHandler = () => {
    
  }

  const msgs = true
  useEffect(()=>{
    toast.warning('you have unread messages')
  },[msgs])

  return (
    <>
    <div className="home">
      <section>

      </section>

      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">More</Link>
      </h1>

      <main>
        {/* Products go here */}
        <ProductCard 
          productsId="random" 
          name="alienware"
          price={155000}
          stock={500}
          photo="https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/franchise/alienware-laptops/dell-alienware-lt-franchise-cd-1920x1440-x16-mod03-collapsed-1.png?fmt=png-alpha&wid=1920&hei=1440"
          handler={addToCartHandler}
        />
      </main>
    </div>
      <Toaster richColors expand={true} closeButton/>
    </>
    
  )
}

export default Home