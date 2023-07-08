import React, { useState, useEffect } from 'react';
import axios from "axios";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import PaymentsTable from './paymentstable';



export default function StagedContent(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_HOST}staging?date=${props.file["date"]}&fileName=${props.file["fileName"]}&phase=staging`);
          const data = response.data
          setData(data);
          console.log(data)
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
  
      fetchData();
    }, [props.file]);

    const handleReject = () => {props.onItemSelected(null)}

    const processPayments = async ( ) => {
      try {
        props.onItemSelected(null)
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}process?date=${props.file["date"]}&fileName=${props.file["fileName"]}`);
        const data = response.data
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    
    }

    return (

    <div>
        <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
                Payment Staging
            </Typography>
            <Typography>
                {props.file["fileName"]}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {props.file["date"]}
            </Typography>
            <Typography variant="body2">
            Total Payments Staged: {data["totalSuccess"]}
            <br />
            Total Payments Rejected: {data["totalRejected"]}
            </Typography>
        </CardContent>
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="center" sx={{mb: 3}}>
                <Button variant="outlined" sx={{width: '200px'}} onClick={handleReject}>
                    <CancelIcon sx={{mr: 1.0}}/>
                    Reject
                </Button>
                <Button variant="contained" sx={{width: '200px'}} onClick={processPayments}>
                  Process Payments
                </Button>
        </Stack>

        <PaymentsTable rows={data["payments"]} type="staging"></PaymentsTable>
    </div>    
    )

}

