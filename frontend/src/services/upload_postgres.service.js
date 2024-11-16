import { toast } from 'react-toastify';
import axios from 'axios';

export const uploadImage = async event => {
  let toastId = null;

  const image = await getImage(event);
  if (!image) return null;

  const formData = new FormData();
  formData.append('image', image, image.name);

  try {
    const response = await axios.post('/api/images/upload', formData, {
      onUploadProgress: ({ progress }) => {
        if (toastId) toast.update(toastId, { progress });
        else toastId = toast.success('Uploading...', { progress });
      },
    });
    
    toast.dismiss(toastId);
    return response.data.imageUrl;  // Assuming backend responds with image URL
  } catch (error) {
    toast.dismiss(toastId);
    toast.error('Image upload failed! Please try again.', 'Upload Error');
    console.error('Upload error:', error);
    return null;
  }
};

const getImage = async event => {
  const files = event.target.files;

  if (!files || files.length <= 0) {
    toast.warning('No file selected. Please choose an image to upload.', 'File Upload');
    return null;
  }

  const file = files[0];

  if (file.type !== 'image/jpeg') {
    toast.error('Only JPG images are allowed.', 'File Type Error');
    return null;
  }

  return file;
};
