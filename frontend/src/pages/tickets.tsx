import React from 'react'
import { Link } from 'react-router-dom'

const Tickets = () => {

  const firstMsg = false   // temp value, will be decided based on BE info
  const isAdmin = false
  const handleSubmit = () => {
    // send the message to the backend and refetch data to populate the current messages
    // also add the type of ticket along with the message when sending data to BE
  }

  return (
    <div className="message">
      <div className="container">
        <div className="breadcrumbs">
          <h1>Customer Tickets</h1>
        </div>
        <div className="messages">
          <div className="owner item">
            <img src="https://i.pinimg.com/736x/54/72/d1/5472d1b09d3d724228109d381d617326.jpg" alt="" />
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
          <div className="item">
            <img src="https://i.pinimg.com/736x/54/72/d1/5472d1b09d3d724228109d381d617326.jpg" alt="" />
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
          <div className="owner item">
            <img src="https://i.pinimg.com/736x/54/72/d1/5472d1b09d3d724228109d381d617326.jpg" alt="" />
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
          <div className="item">
            <img src="https://i.pinimg.com/736x/54/72/d1/5472d1b09d3d724228109d381d617326.jpg" alt="" />
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>

        <hr />

        <form className='write' onSubmit={handleSubmit}>
          {!firstMsg && !isAdmin && (
            <div className="mini">
              <label>Type of ticket?</label>
              <select name="type of ticket" id="">
                <option value="select type">select type</option>
                <option value="billing">billing</option>
                <option value="orders">orders</option>
                <option value="suggestion">suggestion</option>
              </select>
          </div>
          ) }
          <textarea placeholder='write a message'></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default Tickets