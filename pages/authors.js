import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import Highlighter from 'react-highlight-words';

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState([]);

  useEffect(() => {
    axios.get('/api/authors').then((response) => {
      setAuthors(response.data);
      setFilteredAuthors(response.data);
    });
  }, []);

  const handleDelete = (authorId) => {
    axios
      .delete(`/api/authors/${authorId}`)
      .then((response) => {
        console.log('Author deleted successfully');
        const updatedAuthors = authors.filter((author) => author._id !== authorId);
        setAuthors(updatedAuthors);
      })
      .catch((error) => {
        console.error('Error deleting author:', error);
      });
  };

  const handleEdit = (authorId) => {
    const editPagePath = `/authors/edit/${authorId}`;
    window.location.href = editPagePath;
  };

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredData = authors.filter((author) =>
      author.name.toLowerCase().includes(searchText)
    );
    setSearchText(searchText);
    setFilteredAuthors(filteredData);
  };

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

  const columns = [
    {
      name: 'Name of author',
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <Highlighter
          highlightClassName="bg-orange text-white"
          searchWords={[searchText]}
          autoEscape={true}
          textToHighlight={row.name}
        />
      ),
    },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <button className="btn-default" onClick={() => handleEdit(row._id)}>
            Edit
          </button>
          <button className="btn-red" onClick={() => handleDelete(row._id)}>
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      {/* <Link className="btn-primary" href="/authors/new">
        Add new author
      </Link> */}
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={handleSearch}
        style={{ marginTop: '10px' }}
      />
      <DataTable
        className="h1"
        columns={columns}
        data={filteredAuthors}
        pagination
        highlightOnHover
        striped
        customStyles={customRowStyles}
       
      />
    </Layout>
  );
}
