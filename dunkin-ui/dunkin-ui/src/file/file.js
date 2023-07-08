import React from 'react';
import { Container } from "@mui/material";
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CardActions from '@mui/material/CardActions';
import StagedContent from './staged';
import ProcessedContent from './processed';



export default function File(props) {
    const handleItemSelected = () => {
        props.onItemSelected(null)
    }

    return (
        <div>
            <Container maxWidth="m">

                <Card sx={{ minWidth: 275 }}>

                    <CardActions sx={{ justifyContent: 'flex-start' }}>
                        <IconButton 
                            aria-label="close"
                            onClick={handleItemSelected}
                        >
                            <CloseIcon />
                        </IconButton>
                    </CardActions>

                    { props.file["status"] === "staged" ?

                        (
                            <StagedContent file={props.file} onItemSelected={props.onItemSelected}></StagedContent>
                        ) : (<div></div>)

                    }

                    
                    { props.file["status"] === "processed" ?

                        (
                            <ProcessedContent file={props.file} />      
                        ) : (<div></div>)

                    }


                </Card>

            </Container>
        </div>
    )
}
