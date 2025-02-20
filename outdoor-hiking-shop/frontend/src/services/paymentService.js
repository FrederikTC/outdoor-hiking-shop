import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments';

export const createPayment = async (order_id, payment_method, payment_status) => {
  const response = await axios.post(API_URL, {
    order_id,
    payment_method,
    payment_status
  });
  return response.data;
};
