import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Container } from "@mui/material";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



export default function File(props) {
    const [data, setData] = useState([]);


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_HOST}staging?date=${props.file["date"]}&fileName=${props.file["fileName"]}`);
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
            <Container maxWidth="sm">

                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
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
                    <CardActions>
                        <Stack spacing={2} direction="row">
                            <Button variant="outlined">
                                <CancelIcon/>
                                Reject
                            </Button>
                            <Button variant="contained">Process Payments</Button>
                        </Stack>
                    </CardActions>
                </Card>

            </Container>
        </div>
    )
}