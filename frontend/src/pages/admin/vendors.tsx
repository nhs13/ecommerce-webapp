import React, { ReactElement, useState } from 'react'
import Sidebar from "../../components/admin/AdminSidebar"
import Table from '../../components/admin/table'
import { Column } from 'react-table'
import { Link } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";

const Vendors = () => {

  
  interface ColumnType{
    avatar: ReactElement;
    name: string;
    email: string;
    gender: string;
    role: string;
    action: ReactElement;
  }

  const columns: Column<ColumnType>[] = [
    {
      Header: "Avatar",
      accessor: "avatar",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Gender",
      accessor: "gender",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Role",
      accessor: "role",
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
        avatar: (
          <img
            style={{
              borderRadius: "50%",
            }}
            src={img}
            alt="Shoes"
          />
        ),
        name: "Emily Palmer",
        email: "emily.palmer@example.com",
        gender: "female",
        role: "user",
        action: (
          <button>
            <FaTrash />
          </button>
        ),
      },
    
      {
        avatar: (
          <img
            style={{
              borderRadius: "50%",
            }}
            src={img2}
            alt="Shoes"
          />
        ),
        name: "May Scoot",
        email: "aunt.may@example.com",
        gender: "female",
        role: "user",
        action: (
          <button>
            <FaTrash />
          </button>
        ),
      },
  ]
  const [data] = useState<ColumnType[]>(arr)

  return (
    <div className='admin-container'>
      <Sidebar/>
      <main>
        <Table columns={columns} data={data} containerClassname='dashboard-product-box' heading='Vendors' showPagination={true}/>
        {/* <Link to="/admin/product/new" className='create-product-btn'><FaPlus/></Link> */}
      </main>
    </div>
  )
}

export default Vendors