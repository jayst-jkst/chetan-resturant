import axios from 'axios';

// Retrieve user data from local storage, if it exists
export const getUser = () =>
  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

// User login - store user info in localStorage
export const login = async (email, password) => {
  try {
    const { data } = await axios.post('/api/users/login', { email, password });
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// User registration - store user info in localStorage
export const register = async registerData => {
  try {
    const { data } = await axios.post('/api/users/register', registerData);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Log out - remove user data from localStorage
export const logout = () => {
  localStorage.removeItem('user');
};

// Update user profile - store updated info in localStorage
export const updateProfile = async user => {
  try {
    const { data } = await axios.put('/api/users/updateProfile', user);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};

// Change user password
export const changePassword = async passwords => {
  try {
    await axios.put('/api/users/changePassword', passwords);
  } catch (error) {
    console.error('Password change failed:', error);
    throw error;
  }
};

// Get all users based on a search term (optional)
export const getAll = async searchTerm => {
  try {
    const { data } = await axios.get(`/api/users/getAll/${searchTerm ?? ''}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

// Toggle block status for a user
export const toggleBlock = async userId => {
  try {
    const { data } = await axios.put(`/api/users/toggleBlock/${userId}`);
    return data;
  } catch (error) {
    console.error('Failed to toggle block:', error);
    throw error;
  }
};

// Get a single user by ID
export const getById = async userId => {
  try {
    const { data } = await axios.get(`/api/users/getById/${userId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch user by ID:', error);
    throw error;
  }
};

// Update user information
export const updateUser = async userData => {
  try {
    const { data } = await axios.put('/api/users/update', userData);
    return data;
  } catch (error) {
    console.error('User update failed:', error);
    throw error;
  }
};
