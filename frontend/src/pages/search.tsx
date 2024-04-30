import { useState } from "react"

const Search = () => {

  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<number>(100000)
  const [category, setCategory] = useState<string>('')
  const [page, setPage] = useState<number>(1)


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
            <option value="">Sample 1</option>
            <option value="">Sample 2</option>
          </select>
        </div>

      </aside>
      <main></main>
      
    </div>
  )
}

export default Search