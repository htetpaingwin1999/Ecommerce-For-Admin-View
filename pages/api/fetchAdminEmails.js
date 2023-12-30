import axios from 'axios';

export async function fetchAdminEmails() {
  try {
    const response = await axios.get('/api/admins');
    if (response.status === 200) {
      return response.data; // Assuming the response has an "adminEmails" field
    } else {
      console.error('Error fetching admin emails: Invalid response status');
      return [];
    }
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return [];
  }
}

