import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Copyright, materialUiStyles } from '../utils/materialComponentUtils';
import { useHistory } from 'react-router';


export default function MainPage() {
  const classes = materialUiStyles();
  const [textFieldValue, setTextFieldValue] = useState('');
  const history = useHistory();

 const _handleTextFieldChange = (e) => {
    setTextFieldValue(e.target.value);
};

const _handleButtonClick = () => {
  history.push('/recipe?url=' + textFieldValue);
};

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Just Recipe
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Simple Website that removes the unnecessary information from a Cooking Recipe and simplifies it
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item xs={12}>
                  <TextField id="outlined-basic" label="Recipe URL" fullWidth variant="outlined" onChange={_handleTextFieldChange} value={textFieldValue}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" color="primary" fullWidth onClick={_handleButtonClick}>
                    Simplify Recipe
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Copyright/>
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
