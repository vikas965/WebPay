import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:3001/user/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });

      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button style={{width:"100px"}} type="submit">Upload</button>
      </form>
      {imageUrl && (
        <div>
          {/* <h3>Uploaded Image URL:</h3> */}
          {/* <p>{imageUrl}</p> */}
          
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
