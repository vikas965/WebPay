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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ho8ievce');

      const response = await axios.post('https://api.cloudinary.com/v1_1/dffrcy9y7/image/upload', formData);

      setImageUrl(response.data.secure_url.replace("https://res.cloudinary.com/dffrcy9y7/image/upload/", "https://webpaysample.jpg/"));
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
        <button style={{ width: "100px" }} type="submit">Upload</button>
      </form>
      {imageUrl && (
        <div>
          <h3>Uploaded Image URL:</h3>
          <img src={imageUrl} alt="Uploaded" />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
