'use strict'

const express     = require("express"),    
      mongoose    = require('mongoose'),
      bodyParser  = require("body-parser");

const conf        = require('./conf.json'),
      router      = require('./routes/tvshows');

const port        = process.env.PORT || conf.serverPort,
      env         = process.env.NODE_ENV || conf.serverEnv;

// config worker
var Workers = function(idWorker){

    idWorker = idWorker || 0
    // conect to database
    mongoose.connect('mongodb://' + conf.mongoDB.host + '/' + conf.mongoDB.name, function(err, res) {
      if(err) {
            console.log('ERROR: connecting to Database #' + idWorker + '. ' + err);
        } else {
            console.log('worker #' + idWorker + ' is now connected to Database');
        }
    });

    // create server application
    this.server     = express()
                    .use(bodyParser.json());

    this.id         = idWorker;
    
    this.server.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        console.log('# ' + idWorker);
        next();
    });

    this.router     = router(this, mongoose);
};

// run worker
Workers.prototype.run = function(msg){
    this.server.listen(port, function(){
        msg = msg || '';
        if(msg != '') console.log(msg);
    });
};

// Been able to run slave as stand alone;
if(module.parent){
    module.exports = Workers;
}else{
    var worker = new Workers();
    worker.run('worker #0 is now connected to localhost:' + port);    
}