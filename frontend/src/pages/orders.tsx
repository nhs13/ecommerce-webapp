import React, { ReactElement, useState } from 'react'
import Table from '../components/admin/table'
import Sidebar from "../components/admin/AdminSidebar"
import { Column } from 'react-table'
import { FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Orders = () => {
  interface ColumnType{
    _id: string;
    quantity: number;
    discount: number;
    amount: number;
    status: ReactElement;
    action: ReactElement;
  }

  const columns: Column<ColumnType>[] = [
    {
      Header: "ID",
      accessor: "_id",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "Discount",
      accessor: "discount",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ];

  const img = "https://randomuser.me/api/portraits/women/54.jpg";
  const img2 = "https://randomuser.me/api/portraits/women/50.jpg";


  const arr: ColumnType[] = [
    {
        _id: "kuchbhi",
        amount: 4545,
        quantity: 50,
        discount: 100,
        status: <span className='red'>Processing</span>,
        action: <Link to={`/order/kuchbhi`}>View</Link>
    },
    
      
  ]

  const [rows] = useState<ColumnType[]>(arr)

  return (
    <div className='admin-container'>
      <Sidebar/>
      <main>
        <Table columns={columns} data={rows} containerClassname='dashboard-product-box' heading='My Orders' showPagination={rows.length > 6}/>
        {/* <Link to="/admin/product/new" className='create-product-btn'><FaPlus/></Link> */}
      </main>
    </div>
  )
}

export default Orders