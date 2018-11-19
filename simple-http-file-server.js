//simple (and incomplete) http server
var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
var ep = require('./ErrorPage')
var root = "htdocs";
var redirect = false;
var log = require('log-util');

http.createServer((req,res) => {
  // get the filepath part of the url requested
  if(url.parse(req.url).pathname.indexOf(root) == -1)
  {
    redirect = true;
  }

  const { pathname }  = url.parse(req.url);

  log.info("pathname is %s", pathname);

  // get the actual system filepath for this
   var filepath;
   if(redirect)
   {
      filepath = path.join(process.cwd(), root + pathname);
   }
   else
    {
      filepath = path.join(process.cwd(), pathname);
    }

   log.info("filepath is %s", filepath);

   // extract the filename extension
   var extname = String(path.extname(filepath)).toLowerCase();

  // set up mimetypes and associated filename extensions
   var contentType = 'text/html';
    var mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png'
    };
    // set mimetype if it is known
    contentType = mimeTypes[extname] || 'application/octet-stream';

   // see if this file exists
   fs.stat(filepath, (err, stat) => {
     if (err){
       // handle case of file not found
       if (err.code == 'ENOENT')
       {
         errorNum = 404;
         errorPage = new ep(errorNum);
         res.writeHead(errorNum, {"Content-Type": errorPage.type});
         res.write(errorPage.data);
         res.end();
         return;
       }
       //if not a file not found error, we are calling it a 500 error
       else
       {
         errorNum = 500;
         errorPage = new ep(errorNum);
         res.writeHead(errorNum, {"Content-Type": errorPage.type});
         res.write(errorPage.data);
         res.end();
         return;
       }
     }
     //return directory listing if url is directory
     if(stat.isDirectory()) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        var dir = "";

        fs.readdir(filepath, function(err, items) {
            items.forEach(item => {
                dir += `${item}\n`;
            });
            res.write(dir);
            log.info(`Delivered Directory Listing:\n${dir}`);
            res.end();
        });
        return;
      }
     // try to read the file from disk
     fs.readFile(filepath, (err, data) => {
       if(err){
         res.writeHead(500, {"Content-Type": "text/plain"});
         res.end("500 Error\n");
         log.warn("Read file error");
         log.info(err);
         return;
       }
       // send the data to the browser via the response
       res.writeHead(200, {"Content-Type": contentType});
       res.write(data);
       res.end();
       log.info("delivered %s", pathname);
     });
   });

}).listen(8080).on('listening', () => {
  log.info("Server is listening");
});
