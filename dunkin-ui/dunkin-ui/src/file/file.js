import { Container } from "@mui/material";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



export default function File(props) {
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
                        well meaning and kindly.
                        <br />
                        {'"a benevolent smile"'}
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