import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

const DownloadButton = (props) => {
  const downloadFile = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_HOST}report?date=${props.file["date"]}&fileName=${props.file["fileName"]}&type=${props.type}`, 
            { responseType: 'blob' }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        let name = props.file["fileName"].replace(".done", "")
        let filename = `${props.type}_${name}`

        link.setAttribute('download', filename); // Use the file name and extension you want
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download file:', err);
    }
  };

  return (
    <Button variant="outlined" onClick={downloadFile}>
        {buttonText[props.type]}
    </Button>
  );
};

const buttonText = {
    "branch": "By Branch",
    "account": "By Account", 
    "all": "All Payments"
}

export default DownloadButton;
