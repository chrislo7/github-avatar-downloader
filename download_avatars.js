var request = require('request');
var fs = require('fs');
var token = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(JSON.parse(err), JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream(filePath));
}


getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors: ", err);
  for (var i of result){
    console.log("Avatar ID: " +i.login+ ", URL: ", i.avatar_url);
  }
  console.log('Downloading image...')
  for (var x of result){
    var img = x.login;
    downloadImageByURL(x.avatar_url, './avatars/'+x.login+'.jpg');
  }
  console.log('Download Complete.')
});







