import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  handleClick = () => {
    this.fileInput.current.click();
  };

  handleChange = async (event) => {
    console.log(event.target.files[0]); // File selected by the user
    let file = event.target.files[0]
    // You can handle the file from here: upload it using form data or by reading it using FileReader API
    let upload = await this.uploadFile(file)
    upload["fileName"] = upload["filename"]
    upload["status"] = "loading"

    this.props.handleFileUpload(upload)

  };

  uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}payment-instruction`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('File uploaded successfully');
      return response.data
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  

  render() {
    return (
      <div>
        <input 
          type="file" 
          ref={this.fileInput}
          style={{display: 'none'}}
          onChange={this.handleChange}
        />
        <Button variant="outlined" onClick={this.handleClick}>Upload</Button> 
      </div>
    );
  }
}

export default FileUpload;


