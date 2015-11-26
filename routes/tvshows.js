//File: routes/tvshows.js
module.exports = function(worker, mongoose) {

  var TVShow = require('../models/tvshow.js')(mongoose);

  //GET - Return all tvshows in the DB
  findAllTVShows = function(req, res) {
  	TVShow.find(function(err, tvshows) {
  		if(!err) {
        console.log('GET /tvshows')
  			res.send(tvshows);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  findGenreTVShows = function(req, res) {
    TVShow.find({genre: req.params.genre},function(err, tvshows) {
      if(!err) {
        console.log('GET /tvshows/' + req.params.genre)
        res.send(tvshows);
      } else {
        console.log('ERROR: ' + err);
      }
    });
  };

  //GET - Return a TVShow with specified ID
  findById = function(req, res) {
  	TVShow.findById(req.params.id, function(err, tvshow) {
  		if(!err) {
        console.log('GET /tvshow/' + req.params.id);
  			res.send(tvshow);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new TVShow in the DB
  addTVShow = function(req, res) {
  	console.log('POST');
  	console.log(req.body);

  	var tvshow = new TVShow({
  		title:    req.body.title,
  		year: 	  req.body.year,
  		country:  req.body.country,
  		poster:   req.body.poster,
  		seasons:  req.body.seasons,
  		genre:    req.body.genre,
  		summary:  req.body.summary  
  	});

  	tvshow.save(function(err) {
  		if(!err) {
  			console.log('Created');
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});

  	res.send(tvshow);
  };

  //PUT - Update a register already exists
  updateTVShow = function(req, res) {
  	TVShow.findById(req.params.id, function(err, tvshow) {
  		tvshow.title   = req.body.petId;
  		tvshow.year    = req.body.year;
  		tvshow.country = req.body.country;
  		tvshow.poster  = req.body.poster;
  		tvshow.seasons = req.body.seasons;
  		tvshow.genre   = req.body.genre;
  		tvshow.summary = req.body.summary;

  		tvshow.save(function(err) {
  			if(!err) {
  				console.log('Updated');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  			res.send(tvshow);
  		});
  	});
  }

  //DELETE - Delete a TVShow with specified ID
  deleteTVShow = function(req, res) {
  	TVShow.findById(req.params.id, function(err, tvshow) {
  		tvshow.remove(function(err) {
  			if(!err) {
  				console.log('Removed');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  		})
  	});
  }

  //Link routes and functions
  worker.server.get('/tvshows', findAllTVShows);
  worker.server.get('/tvshows/:genre', findGenreTVShows);
  worker.server.get('/tvshow/:id', findById);
  worker.server.post('/tvshow', addTVShow);
  worker.server.put('/tvshow/:id', updateTVShow);
  worker.server.delete('/tvshow/:id', deleteTVShow);

}