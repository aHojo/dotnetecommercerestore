import {
    ButtonGroup,
    Container,
    Typography,
    Button,
    Alert,
    AlertTitle,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import agent from "../../app/api/agent";
import {useState} from "react";

export default function About() {

    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    function getValidationError() {
        agent.TestErrors.getValidationError()
            .then(() => console.log("should not see this"))
            .catch((error) => setValidationErrors(error));

    }
    return (
        <Container>
            <Typography gutterBottom variant="h2">Errors for testing purposes</Typography>
            <ButtonGroup fullWidth>
                <Button variant={'contained'} onClick={() => agent.TestErrors.get400Error().catch(err => console.log(err))}>Test 400 Error</Button>
                <Button variant={'contained'} onClick={() => agent.TestErrors.get401Error().catch(err => console.log(err))}>Test 401 Error</Button>
                <Button variant={'contained'} onClick={() => agent.TestErrors.get404Error().catch(err => console.log(err))}>Test 404 Error</Button>
                <Button variant={'contained'} onClick={() => agent.TestErrors.get500Error().catch(err => console.log(err))}>Test 500 Error</Button>
                <Button variant={'contained'} onClick={getValidationError}>Test Validation Error</Button>
            </ButtonGroup>
            {validationErrors.length > 0 &&
                <Alert severity={"error"} >
                    <AlertTitle>Validation errors</AlertTitle>
                    <List>
                        {validationErrors.map(error => {
                            return (
                                <ListItem key={error}>
                                    <ListItemText>
                                        {error}
                                    </ListItemText>
                                </ListItem>
                            )
                        }
                        )}
                    </List>
                </Alert>
            }
        </Container>

    );
}