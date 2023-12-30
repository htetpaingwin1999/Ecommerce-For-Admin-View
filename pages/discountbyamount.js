import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DataTable from "react-data-table-component";
import DiscountByAmountForm from "@/components/DiscountByAmountForm"; // Import the DiscountByAmountForm component
import Link from "next/link";

const DiscountByAmounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchDiscountByAmount();
  }, []);

  function fetchDiscountByAmount() {
    axios.get("/api/discountbyamount").then((response) => {
      setDiscounts(response.data);
    });
  }

  function deleteDiscountByAmount(discountByAmount) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete this data?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = discountByAmount;
        await axios.delete('/api/discountbyamount?_id=' + _id);
        fetchDiscountByAmount();
      }
    });
  }

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const columns = [
    {
      name: "Amount",
      selector: "amount",
      sortable: true,
    },
    {
      name: "Discount Percentage",
      selector: "discount_percentage",
      sortable: true,
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
    },
    {
      name: "Start Date",
      selector: "start_date",
      sortable: true,
      format: (row) => {
        const date = new Date(row.start_date);
        const year = date.getFullYear();
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        return `${year}, ${month}, ${day}, ${hours}:${minutes}:${seconds}`;
      }
    },
    {
      name: "End Date",
      selector: "end_date",
      sortable: true,
      format: (row) => {
        const date = new Date(row.end_date);
        const year = date.getFullYear();
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        return `${year}, ${month}, ${day}, ${hours}:${minutes}:${seconds}`;
      }
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <Link href={`/discountbyamount/edit/${row._id}`}>
            <button className="btn-default">
              Edit
            </button>
          </Link>
          <button className="btn-red" onClick={() => deleteDiscountByAmount(row)}>
            Delete
          </button>
        </>
      ),
    },
  ];

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  const filteredDiscounts = discounts.filter((discount) =>
    discount.description.toLowerCase().includes(searchValue)
  );

  return (
    <Layout>
      <div className="mb-2">
        <DiscountByAmountForm />
        <input
          type="text"
          placeholder="Search by description..."
          onChange={handleSearch}
          className="mt-5"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredDiscounts}
        pagination
        highlightOnHover
        noHeader
      />
    </Layout>
  );
};

export default DiscountByAmounts;
