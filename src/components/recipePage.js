import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Copyright, materialUiStyles } from '../utils/materialComponentUtils';
import { useLocation } from 'react-router-dom'
import axios from 'axios';

export default function RecipePage() {
  const [recipe, setRecipe] = useState();
  const classes = materialUiStyles();
  const url = new URLSearchParams(useLocation().search).get("url");
  const validUrl = isValidURL(url);

  useEffect(() => {
    if(validUrl) {
      axios.get('/api/recipeFetcher?url=' + url)
      .then(res => {
        setRecipe(res.data);
      })
    }
  }, [validUrl, url]);


  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
      <Container>
            <Paper className={classes.paper}>
              {validUrl ? 
              <Typography component="h1" variant="h4" align="center">
                Just Recipe {recipe.name}
              </Typography>
            : <Typography component="h1" variant="h4" align="center">
                The Recipe URL is not Valid
            </Typography>}
            </Paper>
            <Copyright />
      </Container>
      </main>
    </React.Fragment>
  );
}

function isValidURL(string) {
    if(!string) {
      return false;
    }

    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(string);
};

