import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import { Copyright, Loader, materialUiStyles } from '../utils/materialComponentUtils';
import { useLocation } from 'react-router-dom'
import axios from 'axios';

export default function RecipePage() {
  const [recipe, setRecipe] = useState({
    loading: true
  });
  const classes = materialUiStyles();
  const url = new URLSearchParams(useLocation().search).get("url");
  const validUrl = isValidURL(url);
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    if(validUrl) {
      axios.get('/api/recipeFetcher?url=' + url)
      .then(res => {
        var recipeData = res.data;
        setRecipe({
          loading: false,
          name: recipeData.name,
          description: recipeData.description,
          instructions: recipeData.recipeInstructions,
          ingredients: recipeData.recipeIngredient,
          prepTime: recipeData.prepTime,
          cookTime: recipeData.cookTime,
          totalTime: recipeData.totalTime,
          recipeYield: recipeData.recipeYield,
          recipeCategory: recipeData.recipeCategory,
          image: recipeData.image
        });
      })
    }
  }, [validUrl, url]);


  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
      <Container>
        <Paper className={classes.paper}>
          <Grid container spacing={2} justify="center">
            {validUrl ? 
              recipe.loading ? <Loader /> :
              <Grid container spacing={2}>
                <Grid item xs={12} container>
                  <Grid item xs={7}>
                    <Grid item xs>
                      <Typography variant="h4">
                        {recipe.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recipe.description}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs>
                    <ButtonBase className={classes.image}>
                      <img className={classes.img} alt="complex" src={recipe.image[0]} width="250em" height="250em" />
                    </ButtonBase>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textPrimary">
                        Ingredients
                      </Typography>
                </Grid>
                <List>
                  {recipe.ingredients.map((ingredient, index) => {
                  const labelId = `checkbox-list-label-${index}`;
                  return(
                    <ListItem key={index} role={undefined} dense button onClick={handleToggle(index)}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(index) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`${ingredient}`} />
                    </ListItem>
                  )})}
                </List>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textPrimary">
                        Instructions
                      </Typography>
                </Grid>
                <Grid item xs={12}>
                  {recipe.instructions.map((instruction, index) => (
                    <Paper className={classes.paper}>
                      <Grid container spacing={2} justify="center">
                        <Grid item>
                          <Avatar className={classes.avatar}>{index + 1}</Avatar>
                        </Grid>
                        <Grid item xs>
                          <Typography>{instruction.text}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}  
                 </Grid>   
              </Grid>
            : 
            <Typography component="h1" variant="h4" align="center">
                The Recipe URL is not Valid
            </Typography>}
          </Grid>  
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

