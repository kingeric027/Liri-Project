//Load packages and keys.js
require("dotenv").config();
var fs = require('fs');
var axios = require("axios");
var moment = require("moment");
var keys = require('./keys.js');
var Spotify = require('node-spotify-API');

var command = process.argv[2];
var le = process.argv.length;
var title = process.argv[3];

if(le>4){
    for (i=4;i<le; i++){
        title = title + "%20" + process.argv[i];   
    };
};

function concert(){
    var queryUrl = "https://rest.bandsintown.com/artists/" + title + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response){
            var result = response.data[0]; //Not sure why the axios returns two objects... take 1st one.
            console.log("Venue: " + result.venue.name);
            console.log("Location: "+result.venue.city + ", " + result.venue.country);
            console.log("Date: " + moment(result.datetime).format("LL"));
        }
    )
}

function movie(){
    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function(response){
            var result = response.data;
            console.log("Title: "+result.Title);
            console.log("Year: "+result.Year);
            console.log("IMDB Rating: "+result.imdbRating);
            console.log("Rotton Tomatoes Rating: "+ result.Ratings[1].Value);
            console.log("Country: " + result.Country);
            console.log("Language: "+result.Language);
            console.log("Plot: "+result.Plot);
            console.log("Actors: "+result.Actors);
            
        }
    )
}

function spotify(){
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: title }, function(err, data) {
        if (err){
            console.log('Error occurred: ' + err);
        }

        var songInfo = data.tracks.items;
        console.log("Artist(s): " + songInfo[0].artists[0].name);
        console.log("Song Name: " + songInfo[0].name);
        console.log("Preview Link: " + songInfo[0].preview_url);
        console.log("Album: " + songInfo[0].album.name);
    })
};

function runApp(command){
    if(command == "concert-this"){
        concert();
    }else if(command == "spotify-this-song"){
        spotify();
    }else if(command == "movie-this"){
        movie();
    }
};

if(command == "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error){
            return console.log(error);
        }
        var datasplit = data.split(",");

        command = datasplit[0];
        title = datasplit[1].replace(/ /g, "+");
        runApp(command);
    })
}else{
    runApp(command);
}
   