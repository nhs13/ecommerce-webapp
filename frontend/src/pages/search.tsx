import { useState } from "react"
import { BiSearch } from "react-icons/bi"
import ProductCard from "../components/product-card"

const Search = () => {

  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<number>(100000)
  const [category, setCategory] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const addToCartHandler = () => {

  }

  const isNextPage = page < 4;
  const isPrevPage = page > 1;


  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input 
            type="range" 
            value={maxPrice} 
            onChange={(e)=>setMaxPrice(Number(e.target.value))}
            min={100}
            max={100000}
          >
          </input>
        </div>

        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="Sample 1">Sample 1</option>
            <option value="Sample 2">Sample 2</option>
          </select>
        </div>

      </aside>
      <main>
        <h1>Products</h1>
        <div className="flexer">
          <BiSearch/>
          <input type="text" placeholder="Search by name..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
        </div>
        <div className="search-product-list">
          <ProductCard 
            productsId="random" 
            name="alienware"
            price={155000}
            stock={500}
            photo="https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/franchise/alienware-laptops/dell-alienware-lt-franchise-cd-1920x1440-x16-mod03-collapsed-1.png?fmt=png-alpha&wid=1920&hei=1440"
            handler={addToCartHandler}
          />
        </div>

        <article>
          <button
            disabled={!isPrevPage} 
            onClick={()=>setPage(prev=>prev-1)}>Prev</button>
          <span>{page} of {4}</span>
          <button
            disabled={!isNextPage} 
            onClick={()=>setPage(prev=>prev+1)}>Next</button>
        </article>
      </main>
      
    </div>
  )
}

export default Search