import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Layout from '@/components/Layout';

function BannedUsers() {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [tableKey, setTableKey] = useState(Date.now()); // Initialize a key with the current timestamp

  useEffect(() => {
    // Fetch the list of banned users from your API
    const fetchBannedUsers = async () => {
      try {
        const response = await axios.get('/api/blockClient'); // Replace with your API endpoint
        setBannedUsers(response.data);
      } catch (error) {
        console.error('Error fetching banned users:', error);
      }
    };

    fetchBannedUsers();
  }, []);

  // Define columns for the table
  const columns = [
    {
      name: 'User ID',
      selector: '__id', // Replace with the actual field name in your data
    },
    {
      name: 'Username',
      selector: 'fullName', // Replace with the actual field name in your data
    },
    {
      name: 'Email',
      selector: 'email', // Replace with the actual field name in your data
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleRemoveUser(row)}
          style={{ background: 'red', color: '#fff', padding: '5px' }}
        >
          Remove
        </button>
      ),
      button: true, // Indicates that the cell contains a button
    },
  ];

  const handleRemoveUser = async (user) => {
    // Make the API call to remove the user from the banned list
    const response = await axios.put('/api/blockClient', {
      clientId: user._id,
      __v: 0,
    });

    window.location.reload();
  };

  return (
    <Layout>
      <h2>List of Banned Users</h2>
      <DataTable
        key={tableKey} // Set the key to trigger re-render when it changes
        columns={columns}
        data={bannedUsers}
        pagination
        responsive
      />
    </Layout>
  );
}

export default BannedUsers;
