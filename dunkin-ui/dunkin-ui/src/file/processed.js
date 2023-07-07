import React, { useState, useEffect } from 'react';
import axios from "axios";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DownloadButton from './downloadbutton';



export default function ProcessedContent(props) {
    const [data, setData] = useState([]);


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`
          ${process.env.REACT_APP_API_HOST}staging?date=${props.file["date"]}&fileName=${props.file["fileName"]}&phase=processed`
          );
          const data = response.data
          setData(data);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
  
      fetchData();
    }, [props.file]);

    return (

    <div>
        <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
                Payments Processed
            </Typography>
            <Typography>
                {props.file["fileName"]}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {props.file["date"]}
            </Typography>
            <Typography variant="body2">
            Total Payments Processed: {data["totalSuccess"]}
            <br />
            Total Payments Rejected: {data["totalRejected"]}
            </Typography>

            <Typography variant="h5" component="div" sx={{ mb: 1.5, mt: 1.5 }}>
                Download Reports
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <CardActions >

                    <Stack spacing={2} direction="column">
                        <DownloadButton file={props.file} type="branch"></DownloadButton>
                        <DownloadButton file={props.file} type="account"></DownloadButton>
                        <DownloadButton file={props.file} type="all"></DownloadButton>
                    </Stack>
                </CardActions>
            </Box>
        </CardContent>
        
    </div>    
    )

}