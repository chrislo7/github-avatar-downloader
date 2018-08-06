var request = require('request');
var fs = require('fs');
var token = require('./secrets.js');
var owner = process.argv [2];
var repo = process.argv [3];

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





getRepoContributors(owner, repo, function(err, result) {
  if (!owner || !repo) {
    console.log("Aye i need both dem owner and repo names")
  } else {

      console.log("Errors: ", err);
  for (var i of result){                                              //using for-of loop to grab all IDs
    console.log("Avatar ID: " +i.login+ ", URL: ", i.avatar_url);
  }
  console.log('Downloading images...')
  for (var x of result){                                              //using for-of loop to grab url and create file name based on avatarname
    var img = x.login;
    downloadImageByURL(x.avatar_url, './avatars/'+x.login+'.jpg');
  }
  console.log('Download Complete. Have fun.')
  }

});