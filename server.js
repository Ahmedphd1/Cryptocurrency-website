// functions
async function update(email, botname, bool, something) {
  // Default options are marked with *
  const response = await fetch(`https://zodaiwebapi.herokuapp.com/updatebots&${email}&${botname}&${bool}&${something}`, {
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
//.....................................................................................................

// Load in our dependencies
var express = require('express');
const path = require('path');
const fetch = require('node-fetch');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Register the home route that displays a welcome message
// This route can be accessed without a token
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/welcomepage.html'));
})

// Register the route to get a new token
// In a real world scenario we would authenticate user credentials
// before creating a token, but for simplicity accessing this route
// will generate a new token that is valid for 2 minutes
app.get('/login', function(req, res){
  res.sendFile(path.join(__dirname+'/login.html'))
})

// Register a route that requires a valid token to view data
app.get('/signup', function(req, res){
  res.sendFile(path.join(__dirname+'/signup.html'))
})

app.get('/dashboard/:name', function(req, res){
  if (req.params.name == null) {
    res.sendFile(path.join(__dirname+'/welcomepage.html'))
} else {
    res.sendFile(path.join(__dirname+'/dashboard.html'))
}
})

app.get('/mybots/:name', function(req, res){
  if (req.params.name == null) {
    res.sendFile(path.join(__dirname+'/welcomepage.html'))
  } else {
    res.sendFile(path.join(__dirname+'/mdi.html'))
  }
})

app.get('/dashboardsuccess/:botname&:email', function(req, res){
  update(req.params.email, req.params.botname, true, "ofdgj359g3j9342fk2340fjtg934g9jdslkf24m00").then(data => {
    res.sendFile(path.join(__dirname+'/dashboard.html'))
  })
})

async function checkbots(email) {
  // Default options are marked with *
  const response = await fetch(`https://zodaiwebapi.herokuapp.com/getbots&${email}`, {
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

app.get('/snipingbot/:name&:email', function(req, res){
  checkbots(req.params.email).then(data => {
    console.log(req.params.name)
    if (data['bots']['pancakeswap'] == true && req.params.name == "pancakeswap") {
      res.sendFile(path.join(__dirname+'/pancakeswapui.html'))
    } else if (data['bots']['uniswap'] == true && req.params.name == "uniswap") {
      res.sendFile(path.join(__dirname+'/uniswapui.html'))
    } else if (data['bots']['sushiswap'] == true && req.params.name == "sushiswap") {
      res.sendFile(path.join(__dirname+'/sushiswapui.html'))
    } else {
      res.sendFile(path.join(__dirname+'/dashboard.html'))
    }
  })
})

// Launch our app on port 3000
app.listen('80');