import React from 'react';
import { Container } from "@mui/material";
import Card from '@mui/material/Card';

import StagedContent from './staged';
import ProcessedContent from './processed';



export default function File(props) {

    return (
        <div>
            <Container maxWidth="sm">

                <Card sx={{ minWidth: 275 }}>

                    { props.file["status"] === "staged" ?

                        (
                            <StagedContent file={props.file}></StagedContent>
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
