// BASE SETUP
// =============================================================================
var mongoose   = require('mongoose');
mongoose.connect('mongodb://antonio:casino@ds011462.mlab.com:11462/mms-antonio'); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected");
});
var Meeting    = require('./app/models/meeting');
var Donor       = require('./app/models/donor')
var moment = require('moment');

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 80;        // set our port

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
router.route('/login')
    .post(function(req,res){
        User.findOne({username:req.body.username},function(err,user){
            if(err)
              res.send(err);

            if(!user || user.password !== req.body.password){
                res.json({"message":"username and password do not match"});
            }else{
                res.json(user);
            }
        });

    });


router.route('/donors')
    .post(function(req,res){
        var donor = new Donor();
        donor.firstName = req.body.firstName;
        donor.lastName = req.body.lastName;
        donor.email = req.body.email;
        donor.contact = req.body.contact;
        donor.bloodGroup = req.body.bloodGroup;
        donor.latitude = req.body.latitude;
        donor.longitude = req.body.longitude;
        donor.ip = req.body.ip;

        donor.save(function(err) {
            if (err){
                res.send(err);
            }else{
                res.json({ message: 'Donor created!' });
            }
        });
    }).get(function(req, res) {
        Donor.find(function(err, users) {
            if (err){
                res.send(err);
            }else{
                res.json(users);
            }
        });
    });

  router.route('/donors/:donor_id')
    .get(function(req, res) {
        Donor.findById(req.params.user_id, function(err, donor) {
        if (err){
            res.send(err);
        }else{
            res.json(donor);
        }
      });
    })
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Donor.findById(req.params.meeting_id, function(err, donor) {

            if (err){
                res.send(err);
            }
            donor.username = req.body.username;
            donor.password = req.body.password;
            donor.email = req.body.email;
            donor.contact = req.body.contact;
            donor.bloodGroup = req.body.bloodGroup;
            donor.latitude = req.body.latitude;
            donor.longitude = req.body.longitude;
            donor.ip = req.body.ip;
            // save the bear
            donor.save(function(err) {
                if (err){
                    res.send(err);
                }
                res.json({ message: 'Donor updated!' });
            });

        });
    })
    .delete(function(req, res) {
      Donor.remove({
          _id: req.params.donor_id
      }, function(err, user) {
          if (err){
              res.send(err);
            }
          res.json({ message: 'Donor successfully deleted' });
      });
  });


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
            res.json(meetings);

        });

    });

    // on routes that end in /bears/:bear_id
    // ----------------------------------------------------
  router.route('/meetings/:meeting_id')

      // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
      .get(function(req, res) {
          Meeting.findById(req.params.meeting_id, function(err, meeting) {

          if (err)
              res.send(err);
          res.json(meeting);
        });
      })

      // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
      .put(function(req, res) {

          // use our bear model to find the bear we want
          Meeting.findById(req.params.meeting_id, function(err, meeting) {

              if (err)
                  res.send(err);

              meeting.name = req.body.name;  // update the bears info

              // save the bear
              meeting.save(function(err) {
                  if (err)
                      res.send(err);

                  res.json({ message: 'Meeting updated!' });
              });

          });
      })
      .delete(function(req, res) {
        Meeting.remove({
            _id: req.params.meeting_id
        }, function(err, meeting) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://angular-2-esri-antoniocasino.c9users.io');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
