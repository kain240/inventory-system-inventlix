import axiosInstance from '../services/apiClient';

const DeleteItem = async (id) => {
  try {
    await axiosInstance.delete(`api/inventory/product/${id}/`);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error occurred while deleting:', error);

    // Return more detailed error information
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to delete item'
    };
  }
};

export default DeleteItem;