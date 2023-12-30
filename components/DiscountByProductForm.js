import React, { useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2-bootstrap-theme/dist/select2-bootstrap.min.css";
import "select2/dist/js/select2.full.min.js";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker"; // Import the date picker component
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles

export default function DiscountByProductForm({
  _id,
  productId: existingProductID,
  discount_percentage: existingDiscountPercentage,
  start_date: existingStartDate,
  end_date: existingEndDate,
}) {
  
  const [productId, setProductId] = useState(existingProductID || "");
  const [products, setProducts] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(existingDiscountPercentage || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if(existingProductID == null){
      axios.get("/api/products").then((result) => {
        setProducts(result.data);
        $("#productSelect").select2();
  
        // Listen for changes in Select2
        $("#productSelect").on("select2:select", handleSelectChange);
      });
    }else{
      setStartDate(new Date(existingStartDate.split('T')[0]));
      setEndDate(new Date(existingEndDate.split('T')[0]));
    }
    
    // Clean up Select2 event listener
    return () => {
      $("#productSelect").off("select2:select", handleSelectChange);
    };
  }, []);

  async function saveDiscountByProduct(ev) {
    console.log("Product ID:", productId); // Debugging
    console.log("Discount Percentage:", discountPercentage); // Debugging
    console.log("Start Date:", startDate); // Debugging
    console.log("End Date:", endDate); // Debugging
    ev.preventDefault();
    const data = {
      productId,
      discount_percentage: discountPercentage,
      start_date: startDate,
      end_date: endDate,
    };
    try {
      // Simulate a successful save (you should replace this with actual API calls)
      if(_id){
        await axios.put("/api/discountbyproducts", data);
      // Clear the data
      setProductId("");
      setDiscountPercentage("");
      setStartDate("");
      setEndDate("");
      toast.success("Discount By Product updated successfully!");

      }else{
      // Clear the data
      await axios.post("/api/discountbyproducts", data);
      setProductId("");
      setDiscountPercentage("");
      setStartDate("");
      setEndDate("");
      toast.success("Discount By Product saved successfully!");
      }
    } catch (error) {
      // Show an error toast if save fails
      toast.error("Failed to save discount by product.");
    }
  }

  function handleSelectChange(event) {
    const selectedProductId = event.params.data.id;
    console.log("Selected product ID:", selectedProductId);
    setProductId(selectedProductId);
  }

  return (
    <form onSubmit={saveDiscountByProduct}>
      <label className="block">Product</label>
      <select
        id="productSelect"
        value={productId}
        style={{
            width: "100%", // Make the select box take up full width
            padding: "10px", // Adjust padding as needed
            border: "1px solid #ccc", // Add a border
            borderRadius: "4px", // Add border radius
            boxSizing: "border-box", // Include padding and border in width calculation
          }}
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.title}
          </option>
        ))}
      </select>

      <label className="block">Discount Percentage</label>
      <input
        type="number"
        placeholder="Discount Percentage"
        value={discountPercentage}
        onChange={(ev) => setDiscountPercentage(ev.target.value)}
        min="0"
        max="100"
      />

      {/* Add the Start Date input */}
      <label className="block">Start Date</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="yyyy-MM-dd"
      />

      {/* Add the End Date input */}
      <label className="block">End Date</label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="yyyy-MM-dd"
      />

      <br/>
      <button type="submit" className="btn-primary">
        Save Discount by Product
      </button>
    </form>
  );
}
