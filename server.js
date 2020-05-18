var express = require('express') //requiring express
var app = express() //referencing an instance of express on the app variable

// using app.use function to get a prepped for HTML file in other words for serving static contents
app.use(express.static(__dirname)) //__dirname is used to pass the entire directory

var messages = [
    {name: 'Chepal', message: 'Hi'},
    {name: 'Lampard', message: 'Hey, Mate'}
]
app.get('/messages',(req, res)=>{
    // res.send('Test response') // Testing route   

    res.send(messages) // Sending data   
})


/** 
 * to know on which port we are running, we can use a empty callback function and console log the port
 * we could have hard codded the port in the console log instead of server.address().port
 * but when our app gets deployed we can get refernce to the actual port by creating a variable called server
 * and seeting it to our app.listen() function.
*/
var server = app.listen(3000, () => {
    console.log('Server is listening to the port', server.address().port) 
}) //starting the server and listening to request
