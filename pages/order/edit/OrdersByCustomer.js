import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrdersByCustomer({ clientID, excludedOrderID }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(
          `/api/ordersbycustomers?clientID=${clientID}`
        );
        const filteredOrders = response.data.filter(
          (order) => order._id !== excludedOrderID
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    fetchOrders();
  }, [clientID, excludedOrderID]);

  return (
    <div>
      <h2>Orders for clientID: {clientID}</h2>
      <table className='order-table'>
        <thead>
          <tr>
            <th>Order Date</th>
            <th>Paid</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{new Date(order.updatedAt).toLocaleDateString()}</td>
              <td>{order.paid ? 'Confirm' : 'Pending'}</td>
              <td>
                {order.status === -1
                  ? 'Cancel'
                  : order.status === 0
                  ? 'Pending'
                  : order.status === 1
                  ? 'Order Confirmed'
                  : order.status === 2
                  ? 'Payment Pending'
                  : order.status === 3
                  ? 'Paid Confirmed'
                  : 'Unknown'}
              </td>
              <td>
                {order.line_items.reduce(
                  (total, item) =>
                    total +
                    (item.discount_data
                      ? item.price_data.pay_amount *
                        item.quantity *
                        (1 - item.discount_data.discount_percentage / 100)
                      : item.price_data.pay_amount * item.quantity),
                  0
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
          margin-left: -1400px;
        }

        .checkbox-label input[type='checkbox'] {
          margin-right: 0px; /* Add some spacing between the checkbox and text */
        }
        span {
          margin-left: -1400px;
        }
      `}</style>
    </div>
  );
}

export default OrdersByCustomer;
