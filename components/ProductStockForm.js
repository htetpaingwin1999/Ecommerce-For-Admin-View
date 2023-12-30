import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2-bootstrap-theme/dist/select2-bootstrap.min.css";
import "select2/dist/js/select2.full.min.js";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css";

export default function ProductStockForm({
  _id,
  product: existingProductID,
  quantity: existingQuantity,
  price: existingPrice,
  }
) {
  const [productId, setProductId] = useState(existingProductID || "");
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(existingQuantity || "");
  const [price, setPrice] = useState(existingPrice || "");
  const router = useRouter();
  
  useEffect(() => {
    axios.get("/api/products").then((result) => {
      setProducts(result.data);
      $("#productSelect").select2();

      // Listen for changes in Select2
      $("#productSelect").on("select2:select", handleSelectChange);
    });

    // Clean up Select2 event listener
    return () => {
      $("#productSelect").off("select2:select", handleSelectChange);
    };
  }, []);

  async function saveProductStock(ev) {
    console.log("Product ID:", productId); // Debugging
    console.log("Quantity:", quantity); // Debugging
    console.log("Price:", price); // Debugging
    ev.preventDefault();
    const data = {
      product: productId,
      quantity,
      price,
    };
    try {
        // Simulate a successful save (you should replace this with actual API calls)
        

        if (_id) {
          //update
          await axios.put("/api/productstocks", { ...data, _id });
          setProductId("");
          setQuantity("");
          setPrice("");
          // Show a success toast
          toast.success("Product stock updated successfully!");
        } else {
          //create
          await axios.post("/api/productstocks", data);
          //clear the data
          setProductId("");
          setQuantity("");
          setPrice("");
          // Show a success toast
          toast.success("Product stock saved successfully!");
        }

      } catch (error) {
        // Show an error toast if save fails
        toast.error("Failed to save product stock.");
      }
  }


  function handleSelectChange(event) {
    const selectedProductId = event.params.data.id;
    console.log("Selected product ID:", selectedProductId);
    setProductId(selectedProductId);
  }

  return (
    <form onSubmit={saveProductStock}>
      {
        existingProductID?(
          <>
          <h3 className="block"> {existingProductID? existingProductID.title : ''} </h3><br/>
          </>
        ):(
          <>
            <label className="block">Product</label>
            <select
              id="productSelect"
              value={productId}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
            </select>
          </>
        )
      }

    
        <label>Quantity</label>
        <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(ev) => setQuantity(ev.target.value)}
            min="1"
            style={{
                width: "100%", // Make the input box take up full width
                padding: "8px", // Adjust padding as needed
                border: "1px solid #ccc", // Add a border
                borderRadius: "4px", // Add border radius
                boxSizing: "border-box", // Include padding and border in width calculation
                marginBottom: "10px", // Add some margin at the bottom
              }}
        />

        <label>Price</label>
        <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
            min="1"
            style={{
                width: "100%", // Make the input box take up full width
                padding: "8px", // Adjust padding as needed
                border: "1px solid #ccc", // Add a border
                borderRadius: "4px", // Add border radius
                boxSizing: "border-box", // Include padding and border in width calculation
                marginBottom: "10px", // Add some margin at the bottom
              }}
        />

        <button type="submit" className="btn-primary">Save Product Stock</button>
    </form>
  );
}
