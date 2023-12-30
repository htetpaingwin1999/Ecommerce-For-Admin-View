import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminForm({ onAdminAdded }) {
  const [email, setEmail] = useState("");
  const [isBlock, setIsBlock] = useState(0); // Default to suspended

  async function saveAdmin(ev) {
    ev.preventDefault();

    try {
      const adminData = {
        email,
        isBlock,
      };

      // Call API to save the admin
      await axios.post("/api/admins", adminData);
      onAdminAdded(); // Call the passed function to trigger data refresh

      // Clear the data
      setEmail("");
      setIsBlock(0);

      // Show a success toast
      toast.success("Admin saved successfully!");
    } catch (error) {
      console.error(error);

      // Show an error toast if save fails
      toast.error("Failed to save admin.");
    }
  }

  return (
    <form onSubmit={saveAdmin}>
      <label className="block">Admin Email</label>
      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />

      <label className="block">Block Status</label>
      <select
        value={isBlock}
        onChange={(ev) => setIsBlock(Number(ev.target.value))}
      >
        <option value={-1}>Block</option>
        <option value={0}>Suspend</option>
        <option value={1}>Approve</option>
      </select>

      <br />
      <button type="submit" className="btn-primary">
        Save Admin
      </button>
    </form>
  );
}
