import React, { useState, useEffect } from 'react';
import FileTable from "./filetable";
import axios from "axios";
import './home.css'


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


    return (
        <div>

            <div className="table-container">
                <FileTable rows={data}></FileTable>
                <div>
      {data.length > 0 ? (
        data.map((item, index) => <div key={index}>{item.data}</div>)
      ) : (
        <p>No data to display</p>
      )}
    </div>
            </div>
        </div>

    )
}

export default Home;