import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";
import OrderDetails from "./OrderDetails";

export default function EditOrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const [orderData, setOrderData] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }

    // Define a function to fetch order data
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/orders?id=${id}`);
        const data = response.data; // Assuming the API returns the order data
        setOrderData(data);
        console.log(data);

      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    // Call the function to fetch order data
    fetchOrderData();
  }, [id]);

  return (
    <Layout>
      <h1>Edit Order</h1>
      {orderData ? (
        // Render the order data here
        <div>
          {/* Render order data properties */}
          <OrderDetails order={orderData} />
          
          {/* Add more order data properties as needed */}
        </div>
      ) : (
        // Render a loading or error message here
        <p>Loading order data...</p>
      )}
    </Layout>
  );
}
