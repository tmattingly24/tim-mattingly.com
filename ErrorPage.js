
var fs = require('fs');
var path = require('path');
var log = require('log-util');
var root = "htdocs/errorpages/";


class ErrorPage{

  constructor(errorNum)
  {
    this.data = "Default Error Message...You should not see this..."
    this.errorNum = errorNum;
    this.type = "text/html"; //type of page that will be displayed
    this.getPage();
  }

  getPage()
  {
      //set filepath and read file sync in order to wait for data to be set
      this.filepath = path.join(process.cwd(), root + errorNum + ".html");
      this.data = fs.readFileSync(this.filepath);
      log.warn("Error Number " + this.errorNum + " redirected to " + this.filepath);
      return;
  }

    set data(data)
    {
      this._data = data;
    }

    get data()
    {
      return this._data;
    }

    set type(type)
    {
      this._type = type;
    }

    get type()
    {
      return this._type;
    }

}

module.exports = ErrorPage;
