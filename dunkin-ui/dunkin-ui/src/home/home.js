import React, { useState, useEffect } from 'react';
import FileTable from "./filetable";
import axios from "axios";
import './home.css'

import File from '../file/file';


import FileUpload from './upload';




const Home = () => {
    const [data, setData] = useState([]);
    const [item, setItem] = useState(null)

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_HOST}files`);
          const data = response.data
          setData(data);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
  
      fetchData();
    }, []);

    const handleUpload = (file) => {
      setData(prevData => [file, ...prevData])
    } 

    const handleItemSelected = (item) => {
      setItem(item)
    }


    return (
        <div>

            <div className="table-container">
                {
                  item ? (
                    <File file={item}></File>
                  ) : (
                    <div>
                      <FileTable rows={data} onItemSelected={handleItemSelected} onFileUpload={handleUpload}></FileTable>
                    </div>
                  )
                }

            </div>
        </div>

    )
}

export default Home;