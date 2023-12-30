import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Link from "next/link";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

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
            <button className="btn-default ml-2" style={{ padding: '10px 12px' }}>
              Edit
            </button>
          </Link>
          <button
            className="btn-red ml-2"
            onClick={() => confirmDeleteProduct(row._id)}
            style={{ padding: '10px 12px' }}
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ];

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchValue)
  );

  const confirmDeleteProduct = (productId) => {
    setSelectedProductId(productId);
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the API to delete the product with productId
        axios
          .delete(`/api/products/${productId}`)
          .then(() => {
            // Remove the deleted product from the local state
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product._id !== productId)
            );
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Failed to delete product:", error);
            Swal.fire("Error!", "Failed to delete product.", "error");
          });
      }
    });
  };

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
