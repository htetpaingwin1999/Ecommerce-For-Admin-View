import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DataTable from "react-data-table-component";
import AdminForm from "@/components/AdminForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdminAdded = () => {
    fetchAdmins(); // Fetch the updated list of admins after adding a new admin
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("/api/admins");
      setAdmins(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  const handleIsBlockChange = async (admin, newIsBlock) => {
    if (admin.email === "htetpaingwin1999@gmail.com") {
      toast.warning("It is a default admin, you cannot block.");
      return;
    }

    try {
      await axios.put("/api/admins", {
        _id: admin._id,
        isBlock: newIsBlock,
      });
      toast.success("Admin status updated.");
      fetchAdmins();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update admin status.");
    }
  };
  const columns = [
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "isBlock Status",
      cell: (row) => (
        <select
          value={row.isBlock}
          onChange={(e) => handleIsBlockChange(row, parseInt(e.target.value))}
          style={{
            color: row.email === "htetpaingwin1999@gmail.com" ? "gray" : "black",
            backgroundColor: row.email === "htetpaingwin1999@gmail.com" ? "lightgray" : "white",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          <option value={-1} style={{ color: "white", backgroundColor: "red", padding: "8px 10px", border: "none", outline: "none" }}>
            Block
          </option>
          <option value={0} style={{ color: "white", backgroundColor: "orange", padding: "8px 10px", border: "none", outline: "none" }}>
            Suspend
          </option>
          <option value={1} style={{ color: "white", backgroundColor: "green", padding: "8px 10px", border: "none", outline: "none" }}>
            Approve
          </option>
        </select>
      ),
      sortable: false,
    },
  ];
  return (
    <Layout>
      <Link href="/admin/user-list" style={{background: "#119afa", color:"#fff", padding: "10px", marginTop: "20px", marginLeft: "10px"}}>
          User Cancel List
        </Link>
      <div className="mb-2">
        
        <br/>
        <AdminForm onAdminAdded={handleAdminAdded} /> {/* Pass the handler function */}
        <input
          type="text"
          placeholder="Search by email..."
          onChange={handleSearch}
          className="mt-5"
        />
      </div>
      <DataTable
        columns={columns}
        data={admins}
        pagination
        highlightOnHover
        noHeader
      />
    </Layout>
  );
};

export default Admin;

 