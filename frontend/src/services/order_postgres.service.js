import axios from 'axios';

// Create a new order
export const createOrder = async order => {
  try {
    const { data } = await axios.post('/api/orders/create', order);
    return data;
  } catch (error) {
    console.error('Error creating order:', error.message);
    throw error;
  }
};

// Get the current user's new order
export const getNewOrderForCurrentUser = async () => {
  try {
    const { data } = await axios.get('/api/orders/newOrderForCurrentUser');
    return data;
  } catch (error) {
    console.error('Error fetching new order for current user:', error.message);
    throw error;
  }
};

// Pay for an order
export const pay = async paymentId => {
  try {
    const { data } = await axios.put('/api/orders/pay', { paymentId });
    return data;
  } catch (error) {
    console.error('Error processing payment:', error.message);
    throw error;
  }
};

// Track an order by its ID
export const trackOrderById = async orderId => {
  try {
    const { data } = await axios.get(`/api/orders/track/${orderId}`);
    return data;
  } catch (error) {
    console.error('Error tracking order:', error.message);
    throw error;
  }
};

// Get all orders filtered by status (if provided)
export const getAll = async status => {
  try {
    const endpoint = `/api/orders/${status || ''}`;
    const { data } = await axios.get(endpoint);
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw error;
  }
};

// Get all possible order statuses
export const getAllStatus = async () => {
  try {
    const { data } = await axios.get('/api/orders/allstatus');
    return data;
  } catch (error) {
    console.error('Error fetching all statuses:', error.message);
    throw error;
  }
};
