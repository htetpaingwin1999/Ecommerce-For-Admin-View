import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DataTable from "react-data-table-component";
import AdvertisementForm from "@/components/AdvertisementForm";
import { withSwal } from 'react-sweetalert2';
import Link from "next/link";

const Advertisement = ({ swal }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchAdvertisements();
  }, []);
  function fetchAdvertisements() {
    axios.get("/api/advertisements").then((response) => {
      setAdvertisements(response.data);
    });
  }
  function deleteAdvertisement(advertisement) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete this advertisement?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = discountbyproduct;
        await axios.delete('/api/advertisements?_id=' + _id);
        fetchAdvertisements();
      }
    });
  }

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  // Check if advertisements are not yet loaded
  // if (advertisements === undefined || advertisements.length === 0) {
  //   return <p>Loading...</p>; // You can replace this with a loading indicator
  // }

  // const filteredAdvertisements = advertisements.filter(
  //   (ad) =>
  //     ad.image_path &&
  //     ad.image_paths[0].toLowerCase().includes(searchValue)
  //     );

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const columns = [
    {
      name: "Image",
      cell: (row) => <img src={row.image_paths[0]} alt="Advertisement" style={{ maxWidth: "100px" }} />,
      sortable: false,
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
        
        return `${year}, ${month}, ${day}`;
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
        
        return `${year}, ${month}, ${day}`;
      }
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <Link href={`/advertisements/edit/${row._id}`}>
            <button className="btn-default">
              Edit
            </button>
          </Link>
          <button className="btn-red" onClick={() => deleteAdvertisement(row)}>
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-2">
        <AdvertisementForm />
        <input
          type="text"
          placeholder="Search by image path..."
          onChange={handleSearch}
          className="mt-5"
        />
      </div>
      <DataTable
        columns={columns}
        data={advertisements}
        pagination
        highlightOnHover
        noHeader
      />
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => (
  <Advertisement swal={swal} />
));