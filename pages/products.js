import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  const columns = [
    {
      name: "Product name",
      selector: "title",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link href={`/products/edit/${row._id}`}>
            <button className="btn-default">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                {/* Add the path for the edit icon */}
                <path />
              </svg>
              Edit
            </button>
          </Link>
          <Link href={`/products/delete/${row._id}`}>
            <button className="btn-red ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                {/* Add the path for the delete icon */}
                <path />
              </svg>
              Delete
            </button>
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px", // Adjust the width of the Actions column as per your requirement
    },
  ];

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchValue)
  );

  return (
    <Layout>
      <div className="mb-2">
        <Link className="btn-primary" href={"/products/new"}>
          Add new product
        </Link>
        <input
          type="text"
          placeholder="Search by product name..."
          onChange={handleSearch}
          className="mt-5"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredProducts}
        pagination
        highlightOnHover
        noHeader
      />
    </Layout>
  );
};

export default Products;
