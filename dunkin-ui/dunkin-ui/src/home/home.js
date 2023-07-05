import React, { useState, useEffect } from 'react';
import FileTable from "./filetable";
import axios from "axios";
import './home.css'


import FileUpload from './upload';


const Home = () => {
    console.log(process.env.REACT_APP_API_HOST)
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_HOST}files`);
          const data = response.data
          setData(data);
          console.log(data)
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
  
      fetchData();
    }, []);

    const handleUpload = (file) => {
      setData(prevData => [file, ...prevData])
      console.log(data)
    } 


    return (
        <div>

            <div className="table-container">
                <FileUpload className="upload-btn" handleFileUpload={handleUpload}></FileUpload>
                <FileTable rows={data}></FileTable>

            </div>
        </div>

    )
}

export default Home;