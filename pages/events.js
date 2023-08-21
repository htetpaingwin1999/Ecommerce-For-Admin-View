import Layout from '@/components/Layout';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Highlighter from 'react-highlight-words';
import Link from 'next/link';

const SliderButton = () => {
  const [activeButton, setActiveButton] = useState(0);
  const [avents, setEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  useEffect(() => {
    axios.get('/api/events').then((response) => {
      setEvents(response.data);
      setFilteredEvents(response.data);
    });
  }, []);

  const handleDelete = (eventId) => {
    axios
      .delete(`/api/events/${eventId}`)
      .then((response) => {
        console.log('Author deleted successfully');
        const updateEvents = events.filter((event) => event._id !== eventId);
        setEvents(updateEvents);
      })
      .catch((error) => {
        console.error('Error deleting event:', error);
      });
  };

  const handleEdit = (eventId) => {
    const editPagePath = `/events/edit/${eventId}`;
    window.location.href = editPagePath;
  };

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredData = events.filter((event) =>
      event.title.toLowerCase().includes(searchText)
    );
    setSearchText(searchText);
    setFilteredEvents(filteredData);
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
      name: 'Title of Event',
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
  const event_names = ["သီတင်းကျွတ်", "တန်ဆောင်မုန်း", "သကြန်", "ကဆုန်", "နယုန်"];

  return (
    <Layout>
       <Link className="btn-primary" href="/events/new">
        Add new event
      </Link>
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
        data={filteredEvents}
        pagination
        highlightOnHover
        striped
        customStyles={customRowStyles}
       
      />
      <div className="slider-container flex flex-grow">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="slider-button-label">
            <button
              className={`slider-button ${activeButton === index ? 'on' : 'off'}`}
              onClick={() => handleButtonClick(index)}
            />
            <span className="slider-label">{event_names[index]}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default SliderButton;
