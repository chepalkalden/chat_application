var express = require('express') //requiring express
var app = express() //referencing an instance of express on the app variable

// using app.use function to get a prepped for HTML file in other words for serving static contents
app.use(express.static(__dirname)) //__dirname is used to pass the entire directory

var server = app.listen(3000, () => {
    console.log('Server is listening to the port', server.address().port) //we could have hard codded the port but when our app gets deployed we can get refernce to the actual port by creating a variable called and seeting it to our app.listen() function.
}) //starting the server and listening to request
