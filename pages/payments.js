import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import { withSwal } from 'react-sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResponsiveTable from 'react-responsive-table';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function PaymentPage({ swal }) {
  const [payments, setPayments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

 
  useEffect(() => {
    fetchPayments();
  }, []);

  // Function to fetch payments
  function fetchPayments() {
    axios.get('/api/payments').then(response => {
      setPayments(response.data);
      setFilteredPayments(response.data); // Initialize filteredPayments with all payments
    });
  }


  async function handleDelete(paymentId) {
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
        await axios.delete('/api/payments?_id=' + paymentId);
        fetchPayments();
      }
    });
  }

  async function handleStatusChange(paymentId, newStatus, orderId) {
    if(newStatus !== "1"){
      newStatus = "0";
    }
    // console.log(newStatus);
    try {
      await axios.put('/api/payments?_id='+paymentId, { _id: paymentId,status: newStatus });

      let updateData = '';
      console.log("New Status"+newStatus)
      if(newStatus === "1"){
        updateData = {
          _id: orderId,
          paid: true, //order confirmed
          status: 3,
       };
      }else{
        updateData = {
          _id: orderId,
          paid:false, //order မ confirm
          status: 2,
       };
      }

      console.log(updateData);

     await axios.put(`/api/orders`, updateData);
      toast.success('Status updated successfully', { position: toast.POSITION.TOP_RIGHT });
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  }

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);
    
    // Filter payments based on name, date, and status
    const filteredData = payments.filter((payment) => {
      const dateMatch = (new Date(payment.paymentDate)).toLocaleString().toLowerCase().includes(searchText);
      const paidStatus = (payment.status ? 'pending' : 'confirm').toLowerCase().includes(searchText); // Convert boolean to "yes" or "no" for matching

      return nameMatch || dateMatch || paidStatus;
    });
  
    setFilteredPayments(filteredData);
  };

  const getStatusBadgeClass = (status) => {
   if (status === 0) {
      return 'badge-info'; // Blue background for Pending
    } else if (status === 1) {
      return 'badge-success'; // Green background for Confirm
    }
  };

  const getStatusText = (status) =>{
    
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
      selector: (row) => (new Date(row.paymentDate)).toLocaleString(),
      sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
      format: (row) => {
        const date = new Date(row.paymentDate);
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
      name: 'Products',
      selector: (row) => (
        <>
          {row.orderID.line_items.map(l => (
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
          {row.orderID.line_items.map(l => (
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
        const totalPayAmount = row.orderID.line_items.reduce((acc, l) => acc + l.price_data.pay_amount, 0);
      
        return (
          <>
            {row.orderID.line_items.map(l => (
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
      name: 'Transaction ID',
      cell: (row) => (
        <span className={`badge badge-danger`}>
          {row.transactionID}
        </span>
      ),
      style: {
        width: '50px', // Set the desired width here
      },
    },
    {
      name: 'Screenshot',
      cell: (row) => {
        const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  
        // Function to open the image viewer
        const openLightbox = () => {
          setLightboxIsOpen(true);
        };
  
        // Function to close the image viewer
        const closeLightbox = () => {
          setLightboxIsOpen(false);
        };
  
        return (
          <div>
            <img
              src={row.screenshot}
              alt=""
              onClick={openLightbox}
              style={{ cursor: 'pointer' }}
            />
  
            {lightboxIsOpen && (
              <Lightbox
                mainSrc={row.screenshot}
                onCloseRequest={closeLightbox}
                imageTitle="Screenshot"
              />
            )}
          </div>
        );
      },
      style: {
        width: '50px', // Set the desired width here
      },
    },
    {
      name: 'Action',
      cell: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        
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
            <option value="0">Pending</option>
            <option value="1">Confirm</option>
          </select>
          <button
            className="btn-primary"
            onClick={() => handleStatusChange(row._id, selectedStatus, row.orderID._id)}
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
      <h1>Payment</h1>
      <input
        type="text"
        placeholder="Search by Customer Name..."
        value={searchText}
        onChange={handleSearch}
        style={{ marginTop: '10px' }}
      />
      <DataTable
        columns={columns}
        data={filteredPayments}
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
  <PaymentPage swal={swal} />
));
