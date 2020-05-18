var express = require('express') //requiring express
var bodyParser = require('body-parser') //requiring body parser
var app = express() //referencing an instance of express on the app variable


/**
 * While setting socket.io it needs to be tied with express
 * So, we create a reqular HTTP server with node which we will then share with Express and Socket.io
 */
var http = require('http').Server(app) //creating a http server and pass our express app in the server.
var io = require('socket.io') (http) // requiring the Socket.io and passing a reference to our http Server.


// using app.use function to get a prepped for HTML file in other words for serving static contents
app.use(express.static(__dirname)) //__dirname is used to pass the entire directory
app.use(bodyParser.json()) //this lets bodyParser know that we expect JSON to be coming in with our http request
app.use(bodyParser.urlencoded({extended: false}))
var messages = [
    {name: 'Chepal', message: 'Hi'},
    {name: 'Lampard', message: 'Hey, Mate'}
]


//Get Message Service Endpoint
app.get('/messages',(req, res) => {
    // res.send('Test response') // Testing get request route.  

    res.send(messages) // Sending data   
})


//Post Message Service Endpoint
app.post('/messages', (req,res) => {
    // console.log(req.body) //testing post request route.
    messages.push(req.body)//adding the new messages to the messages array.
    io.emit('message', req.body) //submiting an event (notification) from the server to all clients notifying them of a new message. Here message is the event name and req.body is the message
    res.sendStatus(200)
})


/**
 * Setting up a callback for the Socket Conncection Event that will let us know whenver a new user connects.
 */
io.on('connection', (socket) => {
    console.log('user connected')
})


/** 
 * to know on which port we are running, we can use a empty callback function and console log the port
 * we could have hard codded the port in the console log instead of server.address().port
 * but when our app gets deployed we can get refernce to the actual port by creating a variable called server
 * and seeting it to our app.listen() function.
 */
// var server = app.listen(3000, () => {
//     console.log('Server is listening to the port', server.address().port) 
// }) //starting the server and listening to request
/** 
*When using socket.io and http server with express, we can't listen to Server through express alone so var server = app.listen(3000) should be
* changed to var server = http.listen(3000)
*/
var server = http.listen(3000, () => {
        console.log('Server is listening to the port', server.address().port) 
    })
