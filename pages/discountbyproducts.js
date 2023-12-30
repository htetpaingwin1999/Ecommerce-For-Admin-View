import React from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DiscountByProductForm from "@/components/DiscountByProductForm"; // Import the DiscountByProductForm component
import { withSwal } from 'react-sweetalert2';

function DiscountByProducts({ swal }) {
  const [discounts, setDiscounts] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
   
  }, []);

  useEffect(() => {
    fetchDiscountByProducts();
  }, []);

  function fetchDiscountByProducts() {
    axios.get("/api/discountbyproducts").then((response) => {
      setDiscounts(response.data);
    });
  }
  function deleteDiscountByProduct(discountbyproduct) {
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
        const { _id } = discountbyproduct;
        await axios.delete('/api/discountbyproducts?_id=' + _id);
        fetchDiscountByProducts();
      }
    });
  }
  
  
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const columns = [
    {
      name: "Product",
      selector: "productId.title",
      sortable: true,
    },
    {
      name: "Discount Percentage",
      selector: "discount_percentage",
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
          <Link href={`/discountbyproducts/edit/${row._id}`}>
            <button className="btn-default">
              Edit
            </button>
          </Link>
          <button className="btn-red" onClick={() => deleteDiscountByProduct(row)}>
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
    discount.productId.title.toLowerCase().includes(searchValue)
  );

  return (
    <Layout>
      <div className="mb-2">
        <DiscountByProductForm />
        <input
          type="text"
          placeholder="Search by product name..."
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

export default withSwal(({ swal }, ref) => (
  <DiscountByProducts swal={swal} />
));