import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'select2/dist/css/select2.min.css'; // Import Select2 CSS
import 'select2'; // Import Select2 JS
import jQuery from 'jquery'; // Import jQuery
import DatePicker from 'react-datepicker'; // Import Date Picker
import 'react-datepicker/dist/react-datepicker.css'; // Import Date Picker CSS
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";
import { toast } from "react-toastify"; // Import the toast library for displaying notifications

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});
export default function PaymentForm() {
  const [clientEmail, setClientEmail] = useState('');
  const [client, setClient] = useState(null);
  const [clientOrders, setClientOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState([]);


  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const paymentMethods = [
    { value: 1, label: 'Cash' },
    { value: 2, label: 'K Pay' },
    { value: 3, label: 'AYA Pay' },
    { value: 4, label: 'Wave Money' },
    { value: 5, label: 'CB Pay' },
    { value: 6, label: 'Others' },
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  useEffect(() => {
    if (client) {
      fetchClientOrders(client._id);
    }
    const $select = jQuery('#orderSelect'); // Use jQuery selector
    $select.select2();

    const $selectPayment = jQuery('#paymentMethod'); // Use jQuery selector
    $selectPayment.select2();

  }, [client]);

  async function fetchClientOrders(clientId) {
    try {
      const response = await axios.get(`/api/orders?clientId=${clientId}`);
      const clientOrdersData = response.data;
      setClientOrders(clientOrdersData);
      console.log(clientOrdersData)
    } catch (error) {
      console.error(error);
    }
  }

  async function searchClient() {
    try {
      const response = await axios.get(`/api/clients?email=${clientEmail}`);
      const clientData = response.data;
      setClient(clientData);
      setSelectedOrders([]);
    } catch (error) {
      console.error(error);
      setClient(null);
      setSelectedOrders([]);
    }
  }

  const generateVoucherNumber = createdAt => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
  };

  const handleOrderSelect = (event) => {
    const selectedOptions = event.target.options;
    const selectedOrderIds = [];
    for (let i = 0; i < selectedOptions.length; i++) {
      if (selectedOptions[i].selected) {
        selectedOrderIds.push(selectedOptions[i].value);
      }
    }
    setSelectedOrders(selectedOrderIds);
  };

  const handlePaymentMethodSelect = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleNoteChange = (contentState) => {
    setNote(contentState);
  };

  const handlePaymentDateChange = (date) => {
    setPaymentDate(date);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform the payment submission with selectedOrders
    const formData = {
      paymentMethod: selectedPaymentMethod,
      amount,
      note,
      paymentDate,
    };
    console.log(formData);
  };

  return (
    <div>
      <h2>Payment Form</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
        <button onClick={searchClient} className="btn-primary">Search Customers</button>
      </div>
      {client && (
        <div>
          <p>Selected Customer: {client.name}</p>
          <form onSubmit={handleSubmit} className="text-gray" encType="multipart/form-data">
            <label>Select Orders:</label>
            <select
              id="orderSelect"
              multiple // Add 'multiple' attribute for multiple selection
              value={selectedOrders}
              onChange={handleOrderSelect}
              style={{ width: '900px' }} // Set a fixed width
            >
              {clientOrders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order.orderNumber} - {generateVoucherNumber(order.createdAt)}
                </option>
              ))}
            </select>
            <br/>

            <label>Select Payment Method:</label>
            <select
              id="paymentMethod"
              value={selectedPaymentMethod}
              onChange={handlePaymentMethodSelect}
              style={{ width: '100%' }}
            >
              <option value="">Select a payment method</option>
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>

            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
            />

            <label>Payment Date:</label>
            <DatePicker
            selected={paymentDate}
            onChange={handlePaymentDateChange}
            />

            {/* <label>Note:</label>
            <ReactQuill
              value={note}
              onChange={setNote}
            /> */}
          <br/>

          <label>Images</label>
          <div className="mb-2">
            <ReactSortable
              list={images}
              setList={setImages}
              className="sortable-images flex flex-wrap gap-1"
              handle=".sortable-handle"
              direction="horizontal"  // Set the direction to horizontal
            >
              {images.map((image, index) => (
                <div key={index} className="sortable-image">
                  <img

                    src={URL.createObjectURL(image)}
                    alt={`Advertisement ${index}`}
                    className="sortable-img"
                    style={{ width: "200px", height: "200px" }}  // Adjust the image size here
                  />
                  <div className="sortable-handle">Drag</div>
                </div>
              ))}
            </ReactSortable>
          </div>

          <input
            type="file"
            multiple
            onChange={(ev) => setImages([...ev.target.files])}
          />

          <label>Note</label>
          <div>
            {/* Render ReactQuill only on the client-side */}
            {typeof window !== 'undefined' && (
              <ReactQuill
                value={note}
                onChange={value => setNote(value)}
                placeholder="Note"
              />
            )}
          </div>


            <button type="submit" className='btn-primary mt-3'>
              {isUploading ? <Spinner /> : "Submit Payment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
