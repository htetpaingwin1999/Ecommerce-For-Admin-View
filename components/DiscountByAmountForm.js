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
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles

export default function DiscountByAmountForm({
  _id,
  discount_percentage: existingDiscountPercentage,
  amount : existingAmount,
  start_date: existingStartDate,
  end_date: existingEndDate,
  description: existingDescription,
}) {
  
    // Define modules and formats for React Quill
    const quillModules = {
      toolbar: [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        [{ align: [] }],
        ["clean"],
      ],
    };
  
    const quillFormats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "link",
      "align",
    ];
  
  const [discountPercentage, setDiscountPercentage] = useState(existingDiscountPercentage || "");
  const [amount, setAmount] = useState(existingAmount || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if(_id){
      setStartDate(new Date(existingStartDate.split('T')[0]));
      setEndDate(new Date(existingEndDate.split('T')[0]));  
    }
      
  }, []);

  async function saveDiscountByProduct(ev) {
    console.log("Discount Percentage:", discountPercentage); // Debugging
    console.log("Amount:"+ amount);
    console.log("Start Date:", startDate); // Debugging
    console.log("End Date:", endDate); // Debugging
    console.log("Description", description); // Debugging
    ev.preventDefault();
    const data = {
      discount_percentage: discountPercentage,
      amount : amount,
      start_date: startDate,
      end_date: endDate,
      description : description,
    };
    try {
      // Simulate a successful save (you should replace this with actual API calls)
      if(_id){
        await axios.put("/api/discountbyamount", data);
      // Clear the data
      setDiscountPercentage("");
      setAmount("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      toast.success("Discount By Amount Updated successfully!");

      }else{
      // Clear the data
      await axios.post("/api/discountbyamount", data);
      setDiscountPercentage("");
      setAmount("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      toast.success("Discount By Amount Saved successfully!");
      }
    } catch (error) {
      // Show an error toast if save fails
      toast.error("Failed to save discount by amount.");
    }
  }

  return (
    <form onSubmit={saveDiscountByProduct}>
      <label className="block">Amount</label>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(ev) => setAmount(ev.target.value)}
        min="0"
      />      

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
      <label className="block">Description</label>
      <ReactQuill
        value={description}
        onChange={(value) => setDescription(value)}
        modules={quillModules}
        formats={quillFormats}
        style={{ minHeight: "100px" }}
      />
      <button type="submit" className="btn-primary">
        Save Discount by Amount
      </button>
    </form>
  );
}
