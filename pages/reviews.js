import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";
import { RatingStars } from "@/components/RatingStars";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axios.get("/api/reviews").then((response) => {
      console.log("Review Printing");
      setReviews(response.data);
      console.log(response.data);
    });
  }, []);


  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  const handleDelete = async (reviewId) => {
    Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/reviews?reviewId=${reviewId}`);
          setReviews(reviews.filter((review) => review._id !== reviewId));
          Swal.fire("Deleted!", "The review has been deleted.", "success");
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "An error occurred while deleting the review.", "error");
        }
      }
    });
  };

  const columns = [
    {
      name: "Name",
      selector: "client.fullName",
      sortable: true,
    },
    {
      name: "Book Name",
      selector: "product.title",
      sortable: true,
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
      cell: (row) => {
        const shortDescription = row.description.length > 100
          ? `${row.description.substring(0, 100)}...`
          : row.description;
        return <span>{shortDescription}</span>;
      },
    },
    {
        name: "Rating",
        selector: "rating",
        sortable: true,
        cell: (row) => <RatingStars value={row.rating} />,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button className="btn-delete" style={{ background: "red", color: "white", padding: "10px", borderRadius: "5px" }} onClick={() => handleDelete(row._id)}>
          Delete
        </button>
      ),
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredReviews = reviews.filter((review) =>
    review.name && review.name.toLowerCase().includes(searchValue)
  );

  return (
    <Layout>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search by name..."
          onChange={handleSearch}
          className="mt-5"
        />
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        pagination
        highlightOnHover
        noHeader
        responsive={true} // Enable responsive behavior
      />
    </Layout>
  );
};

export default Review;
