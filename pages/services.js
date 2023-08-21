import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import Highlighter from 'react-highlight-words';
import { withSwal } from 'react-sweetalert2';
import Spinner from "@/components/Spinner";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});

function Services({ swal }) {
  const [editedService, setEditedService] = useState(null);
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // New state for preview image
  const [description, setDescription] = useState('');

  const [searchText, setSearchText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  function fetchServices() {
    axios.get('/api/services').then(result => {
      setServices(result.data);
    });
  }

  async function saveService(ev) {
    console.log("hello");
    ev.preventDefault();
    console.log(title);
    console.log(description);
    console.log(image);
    if (!title || !description || !image) {
      // Validate required fields
      return;
    }
    
    const imageData = new FormData(); // Create a new FormData object
    imageData.append('file', image);
    console.log(imageData);
    
    try {
      // Upload the image first
      const response = await axios.post('/api/uploadService', imageData);
      const imageUrl = response.data.link;
      
      const data = {
        title,
        image: imageUrl,
        description
      };

      console.log("hello");
      console.log(data);
      
      if (editedService) {
        data._id = editedService._id;
        await axios.put('/api/services', data._id);
        setEditedService(null);
      } else {
        await axios.post('/api/services', data._id);
      }
      
      setTitle('');
      setImage(null);
      setPreviewImage(null);
      setDescription('');
      fetchServices();
    } catch (error) {
      console.error(error);
      // Handle error
    }
  }
  

  function editService(service) {
    setEditedService(service);
    setTitle(service.title);
    setImage(service.image);
    setDescription(service.description);
    setPreviewImage(service.image); // Set the previewImage state to service.image
  }

  function deleteService(service) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${service.title}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = service;
        await axios.delete('/api/services?_id=' + _id);
        fetchServices();
      }
    });
  }

  function handleSearch(e) {
    setSearchText(e.target.value.toLowerCase());
  }

  function uploadingImage(ev) { 
    const file = ev.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
      console.log("uploading");
      setIsUploading(false);
    }
  }
  const columns = [
    {
      name: 'Service Title',
      selector: 'title',
      sortable: true,
      cell: row => (
        <Highlighter
          highlightClassName="search-highlight"
          searchWords={[searchText]}
          autoEscape={true}
          textToHighlight={row.title}
        />
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <button className="btn-default mr-1" onClick={() => editService(row)}>
            Edit
          </button>
          <button className="btn-red" onClick={() => deleteService(row)}>
            Delete
          </button>
        </>
      ),
    },
  ];

  const customRowStyles = {
    rows: {
      style: {
        fontSize: '17px',
        '&:nth-child(odd)': {
          backgroundColor: '#D9E1F2',
        },
        '&:nth-child(even)': {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    cells: {
      style: {
        padding: '7px',
        width: '150px',
      },
    },
    headCells: {
      style: {
        textAlign: 'center',
        padding: '7px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#4472C4',
      },
    },
  };

  return (
    <Layout>
      <h1>Services</h1>
      <label>
        {editedService
          ? `Edit service ${editedService.title}`
          : 'Create new service'}
      </label>
      <form onSubmit={saveService}>
        <label className="mx-3">Title</label>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Service title"
            onChange={ev => setTitle(ev.target.value)}
            value={title}
          />
        </div>

        <label>Photo</label>
        <div className="mb-2">
        {previewImage && (
            <div className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
            <img src={previewImage} alt="Preview" className="rounded-lg" />
            </div>
        )}
        {isUploading ? (
            <div className="h-24 flex items-center">
            <Spinner />
            </div>
        ) : (
            <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v12"
                />
            </svg>
            <input
                type="file"
                accept="image/*"
                onChange={uploadingImage}
                className="hidden"
            />
            </label>
        )}
        </div>

        <label>Description</label>
        <div>
          {/* Render ReactQuill only on the client-side */}
          {typeof window !== 'undefined' && (
            <ReactQuill
              value={description}
              onChange={value => setDescription(value)}
              placeholder="Service description"
            />
          )}
        </div>

        <button className="btn-primary mt-2" type="submit">
          Save
        </button>
      </form>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearch}
          value={searchText}
          className="mb-2"
        />
        <DataTable
          columns={columns}
          data={services}
          noHeader
          customStyles={customRowStyles}
          pagination
          highlightOnHover
        />
      </div>
    </Layout>
  );
}

export default withSwal(Services);
