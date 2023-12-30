import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DataTable from "react-data-table-component";
import ProductStockForm from "@/components/ProductStockForm";
import { withSwal } from 'react-sweetalert2';
import Link from "next/link";

function ProductStocks({ swal }) {
  const [productStocks, setProductStocks] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchProductStocks();
  }, []);

  function fetchProductStocks() {
    axios.get('/api/productstocks').then(result => {
      setProductStocks(result.data);
    });
  }
  function deleteProductStock(stock) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete this stock?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = stock;
        await axios.delete('/api/productstocks?_id=' + _id);
        fetchProductStocks();
      }
    });
  }
  

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  const filteredProductStocks = productStocks.filter((productStock) =>
    productStock.product.title.toLowerCase().includes(searchValue)
  );
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const columns = [
    {
      name: "Product Name",
      selector: "product.title",
      sortable: true,
    },
    {
      name: "Quantity",
      selector: "quantity",
      sortable: true,
    },
    {
      name: "Price",
      selector: "product.price",
      sortable: true,
      format: (row) => `$${row.product.price.toFixed(2)}`,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
      format: (row) => {
        const date = new Date(row.date);
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
          <Link href={`/product-stocks/edit/${row._id}`}>
            <button className="btn-default">
              Edit
            </button>
          </Link>
          <button className="btn-red" onClick={() => deleteProductStock(row)}>
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-2">
        <ProductStockForm />
        <input
          type="text"
          placeholder="Search by product name..."
          onChange={handleSearch}
          className="mt-5"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredProductStocks}
        pagination
        highlightOnHover
      />
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => (
  <ProductStocks swal={swal} />
));
