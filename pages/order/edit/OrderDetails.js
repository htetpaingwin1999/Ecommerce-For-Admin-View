import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { useRouter } from 'next/router';
import OrdersByCustomer from './OrdersByCustomer';

function OrderDetails({ order }) {
    const townships = [
        "Kyaek Se (Mandalay)",
        "Myit Tha (Mandalay)",
        "Singaing (Mandalay)",
        "Tada U (Mandalay)",
        "Amarapura (Mandalay)",
        "Aung Myay Tha Zan (Mandalay)",
        "Chan Aye Thar Zan (Mandalay)",
        "Chan Mya Thar Zi(Mandalay)",
        "Maha Aung Mye (Mandalay)",
        "Pathein Gyi (Mandalay)",
        "Pyi Gyi Dagon (Mandalay)",
        "Mahlaing (Mandalay)",
        "Meik Htila (Mandalay)",
        "Tha Zi (Mandalay)",
        "Wun Dwin (Mandalay)",
        "Myin Gyan (Mandalay)",
        "Nah To Gyi (Mandalay)",
        "Taung Tha (Mandalay)",
        "Kyauk Pa Daung (Mandalay)",
        "Nyaung U (Mandalay)",
        "Madaya (Mandalay)",
        "Pyin Oo Lwin (Mandalay)",
        "Bo Ta Taung (Yangon)",
        "Kyi Myin Daing (Yangon)",
        "Ta Mwe (Yangon)",
        "East Dagon (Yangon)",
        "North Dagon (Yangon)",
        "South Dagon (Yangon)",
        "North Okkalapa (Yangon)",
        "South Okkalapa (Yangon)",
        "Mingala Taungnyut (Yangon)",
        "Yankin (Yangon)",
        "Thin Gan Gyun (Yangon)",
        "Daw Bon (Yangon)",
        "Pa Zun Daung (Yangon)",
        "Tha Ke Ta (Yangon)",
        "Than Lyin (Yangon)",
        "Dagon Seikkan (Yangon)",
        "Kyauk Ta Da (Yangon)",
        "Ka Ma Yut (Yangon)",
        "Ahlone (Yangon)",
        "Mingaladon (Yangon)",
        "Seikkan (Yangon)",
        "Lan Ma Daw (Yangon)",
        "Mayan Gon (Yangon)",
        "Insein (Yangon)",
        "Hmaw Bi (Yangon)",
        "Bahan (Yangon)",
        "Hlaing (Yangon)",
        "San Chaung (Yangon)",
        "La Tha (Yangon)",
        "Hle Gu (Yangon)",
        "Shwe Pyi Tha (Yangon)",
        "Hlaing Thaya (Yangon)",
        "Pabedan (Yangon)",
        ]

  const router = useRouter(); // Initialize the router
  const [orders,setOrders] = useState([]);

  const [quantities, setQuantities] = useState(
    order.line_items.map((item) => item.quantity)
  );
  const [selectedTownship, setSelectedTownship] = useState(order.city);
  const [phoneNumber, setPhoneNumber] = useState(order.phone);
  const [address, setAddress] = useState(order.streetAddress);

  const [selectedStatus, setSelectedStatus] = useState('0'); // Default to pending
  const [isChecked, setIsChecked] = useState(false); // Default to unchecked

 
  // Function to handle quantity increment
  const handleIncrement = (index) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] += 1;
    setQuantities(updatedQuantities);
  };

  // Function to handle quantity decrement
  const handleDecrement = (index) => {
    if (quantities[index] >= 1) {
      const updatedQuantities = [...quantities];
      updatedQuantities[index] -= 1;
      setQuantities(updatedQuantities);
    }
  };

  // Function to handle township select change
  const handleTownshipChange = (event) => {
    setSelectedTownship(event.target.value);
  };

  // Function to handle phone number change
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  // Function to handle address change
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  // Function to handle status select change
  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    
    // Check if the new status is not equal to -1
    if (newStatus !== "-1") {
      setIsChecked(false); // Uncheck the checkbox
    }
  
    setSelectedStatus(newStatus); // Update the selected status
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (event) => {
    // Check if the status is -1
    if (selectedStatus == -1) {
      setIsChecked(event.target.checked);
    } else {
      // If status is not -1, prevent checking the checkbox
      setIsChecked(false);
      // Optionally, you can provide feedback to the user that they can't check the checkbox
      alert("You can only approve orders with status -1."+selectedStatus);
    }
  };

  const calculateTotalPayment = (item) => {
    if (item.discount_data) {
      const discountPercentage = item.discount_data.discount_percentage / 100;
      return item.price_data.unit_amount * item.quantity * (1 - discountPercentage);
    } else {
      return item.price_data.pay_amount;
    }
  };

  // Function to handle confirm button click
  const handleConfirm = async () => {

    //block 
    if (isChecked == true) {
      try {
        // Make the API call to block the client
        const response = await axios.put('/api/blockClient', {
          clientId: order.clientID._id,
          __v : -1
        });
        console.log('Client blocked:', response.data);
      } catch (error) {
        console.error('API error:', error);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    }
    // Create a copy of the order's line_items
    const updatedLineItems = [...order.line_items];

    // Update the quantity, total_amount, and pay_amount of each line_item based on the 'quantities' state
    updatedLineItems.forEach((item, index) => {
      const newQuantity = quantities[index];
      item.quantity = newQuantity;

      // Calculate the new total_amount and pay_amount based on the changed quantity
      const unitAmount = item.price_data.unit_amount;
      item.price_data.total_amount = unitAmount * newQuantity;
      item.price_data.pay_amount = unitAmount * newQuantity;

      // Remove items with a quantity of zero
      if (newQuantity <= 0) {
        updatedLineItems.splice(index, 1);
      }
    });

    // Update the order's line_items with the updated array
    const updatedOrder = {
      _id: order._id,
      line_items: updatedLineItems, // Use the updated line_items array
      city: selectedTownship, // Update city with the selected township
      phone: phoneNumber, // Update phone number
      streetAddress: address, // Update address
      status: selectedStatus, // Update status to 1
    };

    try {
      // Make the API call to update the order
      const response = await axios.put('/api/orderQuantityUpdate', updatedOrder);
      console.log('API response:', response.data);

      // If the update was successful, you can navigate to a different page or perform other actions
      // For example, you can redirect to the order page:
      router.push(`/orders/`);
    } catch (error) {
      console.error('API error:', error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  return (
    <div>
      <h1>Order Details</h1>
      <h3>Customer ID: {order.clientID._id}</h3>
      <h3>Customer Name: {order.clientID.fullName}</h3>
      <br/>

      <table className="order-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Quantity</th>
            <th>Unit Amount</th>
            <th>Discount Percentage</th>
            <th>Total Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {order.line_items.map((item, index) => (
            <tr key={index}>
              <td>{item.price_data.product_data.productTitle}</td>
              <td>{item.quantity}</td>
              <td>{item.price_data.unit_amount} {item.price_data.currency}</td>
              <td>
                {item.discount_data ? (
                  `${item.discount_data.discount_percentage}%`
                ) : (
                  '0'
                )}
              </td>
              <td>
                {calculateTotalPayment(item)} {item.price_data.currency}
              </td>
              <td>
                <button className='button' onClick={() => handleDecrement(index)}>-</button>
                {quantities[index]}
                <button className='button' onClick={() => handleIncrement(index)}>+</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <label>Township:</label>
        <select value={selectedTownship} onChange={handleTownshipChange}>
            {townships.map((township, index) => (
                  <option key={index} value={township}>
                    {township}
                  </option>
            ))}
        </select>
      </div>

      <div>
        <label>Phone Number:</label>
        <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
      </div>

      <div>
        <label>Address:</label>
        <input type="text" value={address} onChange={handleAddressChange} />
      </div>

      <div>
        <label>Status:</label>
        <select value={selectedStatus} onChange={handleStatusChange}>
          <option value="0">Pending</option>
          <option value="-1">Cancel</option>
          <option value="1">Order Confirm</option>
        </select>
      </div>

      <div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <span>Block this client</span>
        </label>
      </div>

      <button className="button" onClick={handleConfirm}>
        Save
      </button>

      <OrdersByCustomer clientID={order.clientID._id} excludedOrderID={order._id} />

      <style jsx>{`
        .order-table {
          width: 100%;
          border-collapse: collapse;
        }

        .order-table th,
        .order-table td {
          padding: 8px;
          text-align: center;
          border: 1px solid #ccc;
        }

        .order-table th {
          background-color: #f2f2f2;
        }

        .button {
          background: #119afa;
          margin: 10px;
          padding: 10px;
          color: #fff;
          border-radius: 10px;
        }
        .checkbox-label {
          display: flex;
          margin-left:-1400px;
        }
      
        .checkbox-label input[type="checkbox"] {
          margin-right:0px; /* Add some spacing between the checkbox and text */
        }
        span{
          margin-left:-1400px;
        }
      `}</style>
    </div>
  );
}

export default OrderDetails;
