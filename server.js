// BASE SETUP
// =============================================================================
var mongoose   = require('mongoose');
mongoose.connect('mongodb://antoniocasino:test@ds011462.mlab.com:11462/mms-antonio'); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected");
});
var Meeting    = require('./app/models/meeting');
var moment = require('moment');

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
try{


  router.route('/meetings')

      // create a bear (accessed at POST http://localhost:8080/api/bears)
      .post(function(req, res) {

          var meeting = new Meeting();
          
          meeting.startDate = moment(req.body.startDate, 'DD/MM/YYYY');
          meeting.endDate = moment(req.body.endDate, 'DD/MM/YYYY');
          meeting.registrationStart = moment(req.body.registrationStart, 'DD/MM/YYYY');
          meeting.registrationEnd = moment(req.body.registrationEnd, 'DD/MM/YYYY');
          meeting.name = req.body.name;
          meeting.owner = req.body.owner;
          meeting.location = req.body.location;
          meeting.address = req.body.address;
          // save the bear and check for errors
          meeting.save(function(err) {
              if (err){
                  res.send(err);
              }
              res.json({ message: 'Meeting created!' });
          });


      }).get(function(req, res) {
          Meeting.find(function(err, meetings) {
              if (err){
                  res.send(err);
              }
              else{
                  res.json(meetings);
              }
              console.log("cazzola");
          });

      });
}catch(e){
  console.log(e);
}

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
