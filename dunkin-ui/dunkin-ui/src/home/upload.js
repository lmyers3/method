import React from 'react';
import { Button } from '@mui/material';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  handleClick = () => {
    this.fileInput.current.click();
  };

  handleChange = (event) => {
    console.log(event.target.files[0]); // File selected by the user
    // You can handle the file from here: upload it using form data or by reading it using FileReader API
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


