const cheerio = require("cheerio");
const axios = require("axios").default;

const testUrl = "https://www.inspiredtaste.net/1773/steamed-mussels-in-a-white-wine-broth/";
const defautlErrorMessage = "An error occurred while processing the request";

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
      let jsonRecipe = JSON.parse(listObj[0]);
      // some recipe contain @graph node
      const graphElem = jsonRecipe['@graph'];
      if(graphElem) {
        for(var i in graphElem){
          if(graphElem[i]['@type'] === 'Recipe') {
            jsonRecipe = graphElem[i];
          }
        }
      }

      return jsonRecipe;
    } catch(e) {
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

  