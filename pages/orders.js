import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import { withSwal } from 'react-sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResponsiveTable from 'react-responsive-table';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import Link from "next/link";

function OrdersPage({ swal }) {
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  const ExpandableButton = ({ isRowExpanded, onClick }) => (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      {isRowExpanded ? <IoIosArrowDown /> : <IoIosArrowForward />}
    </div>
  );
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to fetch orders
  function fetchOrders() {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
      setFilteredOrders(response.data); // Initialize filteredOrders with all orders
    });
  }


  async function handleDelete(orderId) {
    swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this order?',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete('/api/orders?_id=' + orderId);
        fetchOrders();
      }
    });
  }

  async function handleStatusChange(orderId, newStatus) {
    console.log(orderId);
    try {
      await axios.put('/api/orders?_id='+orderId, { _id: orderId,status: newStatus });
      toast.success('Status updated successfully', { position: toast.POSITION.TOP_RIGHT });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);
    
    // Filter orders based on name, date, and status
    const filteredData = orders.filter((order) => {
      const nameMatch = order.clientID.fullName.toLowerCase().includes(searchText);
      const dateMatch = (new Date(order.createdAt)).toLocaleString().toLowerCase().includes(searchText);
      const streetAddressMatch = order.streetAddress.toString().toLowerCase().includes(searchText);
      const paidMatch = (order.paid ? 'yes' : 'no').toLowerCase().includes(searchText); // Convert boolean to "yes" or "no" for matching

      return nameMatch || dateMatch || paidMatch;
    });
  
    setFilteredOrders(filteredData);
  };

  const getStatusBadgeClass = (status) => {
    if (status === -1) {
      return 'badge-danger'; // Red background for Cancel
    } else if (status === 0) {
      return 'badge-info'; // Blue background for Pending
    } else if (status === 1) {
      return 'badge-success'; // Green background for Confirm
    } else {
      return 'badge-secondary'; // Default style for Unknown
    }
  };

  const getStatusText = (status) =>{
    if(status == -1){
      return "cancel";
    }
    if(status == 0){
      return "pending";
    }
    return "confirm";
  }

  const customRowStyles = {
    rows: {
      style: {
        fontSize: '12px',
        '&:nth-child(odd)': {
          backgroundColor: '#fff',
        },
        '&:nth-child(even)': {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    cells: {
      style: {
        padding: '7px',
        width: '150px',
      },
    },
    headCells: {
      style: {
        textAlign: 'center',
        padding: '7px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#119afa',
      },
    },
  };

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const columns = [
    {
      name: 'Customer Name',
      selector: (row) => row.clientID.fullName,
      sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
      responsive: 'lg', // Hide on screens smaller than large (lg)

    },
    {
      name: 'Date',
      selector: (row) => (new Date(row.createdAt)).toLocaleString(),
      sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
      format: (row) => {
        const date = new Date(row.createdAt);
        const year = date.getFullYear();
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        return `${year}, ${month}, ${day}`;
      }
    },
    {
      name: 'Paid',
      selector: (row) => (row.paid ? 'YES' : 'NO'),
      sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
    },
    // {
    //   name: 'Address',
    //   selector: (row) => (
    //     <>
    //       {row.name} {row.email}<br />
    //       {row.city} {row.postalCode} {row.country}<br />
    //       {row.streetAddress}
    //     </>
    //   ),
    //   sortable: true,
    //   style: {
    //     width: '10px', // Set the desired width here
    //   },
    // },
    {
      name: 'Products',
      selector: (row) => (
        <>
          {row.line_items.map(l => (
            <>
              {l.price_data?.product_data.productTitle}<br/>
            </>
          ))}
        </>
      ),
      sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
    },
    {
      name: 'Quantitiy',
      selector: (row) => (
        <>
          {row.line_items.map(l => (
            <>
              {l.quantity}အုပ်<br/>
            </>
          ))}
        </>
      ),
      sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
    },
    {
      name: 'PayAmount',
      selector: (row) => {
        // Calculate the sum of l.pay_amount
        const totalPayAmount = row.line_items.reduce((acc, l) => acc + l.price_data.pay_amount, 0);
      
        return (
          <>
            {row.line_items.map(l => (
              <>
                {l.price_data.pay_amount}ကျပ်<br />
              </>
            ))}
            Total Pay Amount: {totalPayAmount} {/* Display the sum */}
          </>
        );
      }
      ,sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
    },
    {
      name: 'Status',
      cell: (row) => (
        <span className={`badge badge-danger`}>
          {getStatusText(row.status)}
        </span>
      ),
      style: {
        width: '50px', // Set the desired width here
      },
    },
    {
      name: 'Action',
      cell: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link href={`/order/edit/${row._id}`}>
              <button
                style={{
                  background: 'violet',
                  color: '#fff',
                  width: '100px',
                  padding: '5px 10px',
                  borderRadius: '5%',
                  textDecoration: 'none',
                  display: 'inline-block',
                  marginBottom: '10px', // Add spacing between buttons
                }}
              >
                View
              </button>
          </Link>
          <br/>
          <button onClick={() => handleEdit(row._id)}
            style={{background:"#119afa", color:"#fff", width:"100px",padding:"5px 10px", borderRadius:"5%"}}
          >
            Edit
          </button>
          <br/>
          <button onClick={() => handleDelete(row._id)}
            style={{background:"red", color:"#fff", width:"100px",padding:"5px 10px", borderRadius:"5%"}}
          >
            Delete
          </button>
          <br/>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{background:"orange", color:"#fff", width:"100px",padding:"5px 10px", borderRadius:"5%", border:"0", outline:"0"}}
          >
            <option value="-1">Order Cancel</option>
            <option value="0">Order Pending</option>
            <option value="1">Order Confirm</option>
          </select>
          <button
            className="btn-primary"
            onClick={() => handleStatusChange(row._id, selectedStatus)}
          >
            Update Status
          </button>
          {/* Add Cancel, Confirm, and Pending buttons here */}
        </div>
      ),
      style: {
        width: '300px', 
      },
    },
    
  ];

  return (
    <Layout>
      <ToastContainer />
      <h1>Orders</h1>
      <input
        type="text"
        placeholder="Search by Customer Name..."
        value={searchText}
        onChange={handleSearch}
        style={{ marginTop: '10px' }}
      />
      <DataTable
        columns={columns}
        data={filteredOrders}
        pagination
        highlightOnHover
        striped
        customStyles={customRowStyles}
        responsive={true} // Enable the responsive feature 
      />
    </Layout>
  );
}
export default withSwal(({ swal }, ref) => (
  <OrdersPage swal={swal} />
));
