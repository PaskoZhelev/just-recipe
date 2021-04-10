const cheerio = require("cheerio");
const axios = require("axios").default;

const testUrl = "https://www.inspiredtaste.net/1773/steamed-mussels-in-a-white-wine-broth/";
const defautlErrorMessage = "Unable to find recipe on that page";

exports.handler = async event => {
    try {
      const url = event.queryStringParameters.url

      validateResult(url)
      
      const jsonRecipe = await scrapeRecipe(url);

      return {
        statusCode: 200,
        body: JSON.stringify(jsonRecipe),
        headers: {
          "Content-Type": "application/json",
        }
      }
    } catch (error) {
      return {
          statusCode: error.statusCode || 500,
          body: JSON.stringify(error)
      };
    }
  }

  const validateResult = (val) => {
    if (val === undefined) {
      throw "error";
    }
  }

  const scrapeRecipe = async url => {
    const htmlResponse = await fetchHtml(url);
    
    var $ = cheerio.load(htmlResponse);
    var obj = $("script[type='application/ld+json']");
    var listObj = [];

    for(var i in obj){
        for(var j in obj[i].children){
            var data = obj[i].children[j].data;
            if(data){
              listObj.push(data);
            }
        }
    }

    // no json scripts found on the page
    if(listObj.length === 0) {
      throw defautlErrorMessage;
    }

    try {
      let graphElem;
      let recipe = undefined;
      for(var k in listObj) {
        if(IsJsonString(listObj[k])) {
          const json = JSON.parse(listObj[k]);
          
          if(json[0]) {
            for(var i in json) {
              recipe = findRecipe(json[i]);

              if(recipe) {
                console.log(recipe)
                return recipe;
              }
            }
          }

          recipe = findRecipe(json);

          if(recipe) {
            return recipe;
          }
        }
      }
      
      throw defautlErrorMessage;
    } catch(e) {
        console.log(e);
        throw defautlErrorMessage;
    }
    
  }

  const fetchHtml = async url => {
    try {
      const { data } = await axios.get(url);
      return data;
    } catch {
      throw `ERROR: An error occurred while trying to fetch the URL: ` + url;
    }
  };

  const IsJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

const findRecipe = (json) => {
  let graphElem;
  if('Recipe' === json['@type']) {
    return json;
  }

  graphElem = json['@graph'];
  if(graphElem) {
    for(var i in graphElem){
      if(graphElem[i]['@type'] === 'Recipe') {
        return graphElem[i];
      }
    }
  }

  return undefined;
}

  