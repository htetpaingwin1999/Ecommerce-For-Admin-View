export async function fetchAdminIsBlockStatus(email) {
    try {
      const response = await axios.get(`/api/admins?email=${email}`);
      if (response.status === 200) {
        const adminData = response.data; // Assuming the response has the admin data
        return adminData.isBlock; // Return the isBlock status
      } else {
        console.error('Error fetching admin isBlock status: Invalid response status');
        return null;
      }
    } catch (error) {
      console.error('Error fetching admin isBlock status:', error);
      return null;
    }
  }
