import { FaPlus } from "react-icons/fa"

interface productProps {
    productsId : string
    photo : string
    name : string
    price : number 
    stock : number 
    handler : () => void
}

const serverKaLink = "tempRandomStr"

const ProductCard = ({
    productsId,
    photo, 
    name, 
    price, 
    stock, 
    handler
} : productProps) => {
  return (
    <div className="product-card">
        <img src={photo} alt={name} />
        <p>{name}</p>
        <span>₹{price}</span>
        <div>
            <button onClick={()=>handler()}>
                <FaPlus/>
            </button>
        </div>
    </div>
  )
}

export default ProductCard