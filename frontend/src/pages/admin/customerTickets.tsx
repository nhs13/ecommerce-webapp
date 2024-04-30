import React from 'react'
import { Link } from 'react-router-dom'

const CustomerTickets = () => {

  const something = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda et eos at dolore dicta quisquam maxime, illo tempore dolor consequuntur! Odio quo vel modi quaerat repellat earum similique quia eaque numquam sit eius, blanditiis maxime quae temporibus libero voluptatem at! Ratione vero amet voluptas, odit veritatis, commodi laudantium impedit non culpa in tempora molestiae facilis consectetur! Necessitatibus maiores sapiente quia totam iure delectus earum molestias vel veritatis quas veniam accusamus nostrum assumenda recusandae sint libero inventore nihil ipsam sed amet hic, eaque saepe qui cumque? Reprehenderit dolorem illum, harum enim incidunt pariatur optio tenetur saepe neque, ullam nobis consectetur voluptate quos quam beatae dolore officia voluptatum quaerat laboriosam ex dignissimos natus! Corporis at modi ipsum. Sequi beatae, corrupti veniam numquam odit et magnam vitae impedit magni eligendi laborum tempore. Beatae ab iure doloribus cum sint itaque enim repudiandae illum nobis maiores. Delectus quisquam doloremque fugiat dignissimos possimus inventore dolore modi."
  const readd = true 

  const handleClick = () =>{
    
  }

  return (
    <div className='messages2'>
      <div className="container2">
        <div className="title"><h1>Customer Tickets</h1></div>
        <table>
            <tr>
              {/* buyer hai ya seller hai  */}
              <th>Customer Name</th>
              <th>Last Message</th>
              <th>Date</th>
              <th>Action</th>
              </tr>
              <tr className='active'>
                <td>Customer 1</td>
                <td><Link to={`/tickets`}>{something.substring(0,100)}...</Link></td>
                <td>12/10/24</td>
                <td><button>
                  Mark as read  
                </button></td>
              </tr>
              <tr className=''>
                <td>Customer 1</td>
                <td><Link to={`/tickets`}>{something.substring(0,100)}...</Link></td>
                <td>12/10/24</td>
                <td>
                  {readd ? <button disabled>Mark as read</button> : 
                  <button> Mark as read </button>}
                </td>
              </tr>
              <tr className='active'>
                <td>Customer 1</td>
                <td><Link to={`/tickets`}>{something.substring(0,100)}...</Link></td>
                <td>12/10/24</td>
                <td><button onClick={handleClick}>
                  Mark as read  
                </button></td>
              </tr>
            
          </table>
      </div>
    </div>
  )
}

export default CustomerTickets