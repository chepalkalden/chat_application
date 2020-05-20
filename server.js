var express = require('express') //requiring express
var bodyParser = require('body-parser') //requiring body parser
var app = express() //referencing an instance of express on the app variable


/**
 * While setting socket.io it needs to be tied with express
 * So, we create a reqular HTTP server with node which we will then share with Express and Socket.io
 */
var http = require('http').Server(app) //creating a http server and pass our express app in the server.
var io = require('socket.io') (http) // requiring the Socket.io and passing a reference to our http Server.

/**
 * For DB Conncetion on MongoDB using mongoClient driver
 */
// const MongoClient = require('mongodb').MongoClient;
var mongoose = require ('mongoose')

// using app.use function to get a prepped for HTML file in other words for serving static contents
app.use(express.static(__dirname)) //__dirname is used to pass the entire directory
app.use(bodyParser.json()) //this lets bodyParser know that we expect JSON to be coming in with our http request
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise //letting Mongoose know that the Promise library wants to use is the default ES6 Promise library.

//data structure i.e. model and schema  for our message object
var Message = mongoose.model('Message', {
    name: String,
    message: String
})


// var messages = [
//     {name: 'Chepal', message: 'Hi'},
//     {name: 'Lampard', message: 'Hey, Mate'}
// ]


//Get Message Service Endpoint
app.get('/messages',(req, res) => {
    // res.send('Test response') // Testing get request route.  
    Message.find({}, (err,messages) =>{
        res.send(messages)
    })
})


//Post Message Service Endpoint
app.post('/messages', (req,res) => {
    // console.log(req.body) //testing post request route.

    //message object based on the model to pass into db
    var message = new Message (req.body)


    // message.save((err) => {
    //     if(err)
    //         sendStatus(500)//server error
        /**
         * Demonstrating Nested Callback by censoring the word "Tottenham" in our message.
         */
    //     Message.findOne({message: 'Tottenham'}, (err, censored) => {
    //         if(censored){
    //             console.log('censored word found', censored)
    //             Message.deleteOne({_id: censored.id}, (err) =>{
    //                 console.log('censored message removed !!!')
    //             })
    //         }
    //     })
    //     // messages.push(req.body)//adding the new messages to the messages array.
    //     io.emit('message', req.body) //submiting an event (notification) from the server to all clients notifying them of a new message. Here message is the event name and req.body is the message
    //     res.sendStatus(200)
    // })


    /**
     * Optimizing the above nested callback functions using promise
    */
    message.save()
    .then(() => {
        console.log('Saved')
        return Message.findOne({message: 'Tottenham'})
    })
    .then(censored => {
        if(censored){
            console.log('censored word found', censored)
           return Message.deleteOne({_id: censored.id})
        }
        // messages.push(req.body)//adding the new messages to the messages array.
        io.emit('message', req.body) //submiting an event (notification) from the server to all clients notifying them of a new message. Here message is the event name and req.body is the message
        res.sendStatus(200)
    })
    .catch((err) =>{
        res.sendStatus(500)
        return console.error(err) //returining an error with error message.
    })
})


/**
 * Setting up a callback for the Socket Conncection Event that will let us know whenver a new user connects.
 */
io.on('connection', (socket) => {
    console.log('user connected')
})

/**
 * Connecting to db using MongoClient
 */
 
const uri = "mongodb+srv://chepal:admin@personalproject-fj3v9.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useUnifiedTopology: true }, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('mongo db connection', err)
//   client.close();
// });

mongoose.connect(uri, { useUnifiedTopology: true , useNewUrlParser: true }, (err) =>{
  console.log('mongo db connection', err)
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
