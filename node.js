var http = require('http');
var mysql = require('mysql');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

const RANK_NONE = 0;
const RANK_BASIC = 1;
const RANK_FULL = 2;
const RANK_MANAGE = 3;

var db = mysql.createConnection({
  host: "localhost",
  user: "node",
  password: "nodejspw",
  database: "xmastree",
  dateStrings: 'date'
});

var isDBConnected = false;

function stringifyMySQLResponse(cmd, rsp) {
  if(rsp === undefined) {
    return "Blank response";
  }
  let msg = {command: cmd, result: rsp};
  return JSON.stringify(msg);
}

function stringifyMySQLResponseToTable(cmd, rsp, count, latest) {
  if(rsp === undefined) {
    return "Blank response";
  }
  if(isNaN(count) || count < 1) {
    count = 99;
  }
  if(count > rsp.length) {
    count = rsp.length;
  }
  let msg = "<div id=\"command\">" + cmd + "<div id=\"response\"><table id=\"data\" style=\"border-collapse: collapse\">";
  msg += "<tr>"
  msg += objToLabelTr(rsp[0]);
  msg += "</tr>";
  if(latest) {
    for(var i = rsp.length-1; i > rsp.length-count-1; i--) {
      msg += "<tr>" + objToTr(rsp[i]) + "</tr>";
    }
  } else {
    for(var i = 0; i < rsp.length; i++) {
      msg += "<tr>" + objToTr(rsp[i]) + "</tr>";
    }
  }
  return msg + "</table></div>";
}
function objToLabelTr(obj) {
  if(!(obj === undefined)) {
    let keys = Object.keys(obj);
    let msg = "";
    for (let [key, value] of Object.entries(obj)) {
      msg += "<td style=\"border:1px solid black;\">" + `${key}` + "</td>";
    }
    return msg;
  } else {
    return "<td style=\"border:1px solid black;\">null</td>";
  }
}
function objToTr(obj) {
  let keys = Object.keys(obj);
  let msg = "";
  for (let [key, value] of Object.entries(obj)) {
    msg += "<td style=\"border:1px solid black;\">" + `${value}` + "</td>";
  }
  return msg;
}
function objToString(obj, ishtml) {
  if(obj === undefined) {
    return "undefined";
  } else {
    let keys = Object.keys(obj);
    let msg = "";
    let tag1 = "";
    let tag2 = " ";
    if(ishtml) {
      tag1 = "<xmp>";
      tag2 = "</xmp> ";
    }
    for (let [key, value] of Object.entries(obj)) {
      msg += tag1 + `${key}: ${value}` + tag2;
    }
    return msg;
  }
}

function prevent(test, ...vals) {
    for(let i = 0; i < vals.length; i++) {
      let val = vals[i];
      if(test == val || test === val) {
        return false;
      }
    }
    return true;
}
function defined(...tests) {
  for(let i = 0; i < tests.length; i++) {
    if(tests[i] === undefined) {
      return false;
    }
  }
  return true;

  for (let [key, value] of Object.entries(obj)) {
    msg += "<td style=\"border:1px solid black;\">" + `${key}` + "</td>";
  }
}

db.connect(function(err) {
  if(err) {
    throw err;
  } else {
    console.log("Connected to MySql");
    isDBConnected = true;
  }
});

function sendFile(res, type, name) {
  res.writeHead(200, {'Content-Type': type});
  fs.readFile(name, function(err, data) {
    res.end(data);
  });
}

var reqnum = 0;

var tokens = new Map();

http.createServer(function (req, res) {
  console.log("---- New HTTP " + req.method + " Request " + reqnum++ + " ----------------");
  const args = url.parse(req.url, true).query;
  let path = req.url.substr(1, req.url.length);
  if(req.url.indexOf("?") > -1) {
    path = req.url.substr(1, req.url.indexOf('?')-1);
  }
  console.log("Path: " + path);
  switch(path) {
  case "favicon.ico": {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("");
  } break;
  case "db": {
    if(req.method == "POST") {
      var body = '';
      var killed = false;

      req.on('data', function (data) {
          body += data;
          // Too much POST data, kill the connection! 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
          if (body.length > 1e6) { req.connection.destroy(); killed = true;}
      });

      req.on('end', function () {
        if(!killed) {
          var post = qs.parse(body);
          if(!(post.action === undefined)) {
            console.log("Action: " + post.action);
            switch(post.action) { // Post requests
            case "new": { // Will soon be removed
              if(isDBConnected && defined(post.table)) {
                let fields = "";
                let values = "";
                let first = true;
                for (const property in post) {
                  if(prevent(`${property}`, "action", "table")) {
                    if(first) {
                      first = false;
                    } else {
                      fields += ",";
                      values += ", ";
                    }
                    fields += `${property}`;
                    values += `'${post[property]}'`;
                  }
                }
                if(post.table == "people") {
                  if(!first) {
                    fields += ",";
                    values += ", ";
                  }
                  fields += "uuid_bin";
                  values += "unhex(replace(uuid(),'-',''))";
                } else {
                  post.name = "Order";
                }
                let query = "INSERT INTO " + post.table + " (" + fields + ") VALUES (" + values + ");";
                console.log(query);
                db.query(query, function (err, result, fields) {
                  res.end(post.name + " added successfully");
                  console.log("Person added");
                });
              } else {
                res.end("DB not connected");
              }
            } break;
            case "edit": {
              if(isDBConnected && post.table !== null && post.field !== null) {
                let fieldstr = "";
                let ff = true;
                let fields = [];
                let values = [];
                for (const property in post) {
                  if(`${property}` != "uuid" && `${property}` != "action" && `${property}` != "field" && `${property}` != "table") {
                    if(ff) { ff = false;
                    } else { fieldstr += ","; }
                    fieldstr += `${property}`;
                    fields.push(`${property}`);
                    values.push(`${post[property]}`);
                  }
                }
                let testquery = "SELECT " + fieldstr + " FROM " + post.table + " WHERE " + post.field + " LIKE '" + post.uuid + "';";
                console.log(testquery);
                db.query(testquery, function (err0, result0, fields0) {
                  if(result0.length > 1) {
                    res.end("Something Goofed");
                    console.log("There were too many results, expected 1 got " + result0.length);
                    console.log("This likley means that " + post.uuid + " has multiple entries");
                  }
                  let obj = result0[0];
                  if(!(obj === undefined)) {
                    let chl = "";
                    let chf = true;
                    let chka = [];
                    let chva = [];
                    let choa = [];
                    for (let [key, value] of Object.entries(obj)) {
                      if(`${value}` != `${post[key]}`) {
                        if(chf) { chf = false }
                        else { chl += ",";}
                        chl += `${key}='${post[key]}'`;
                        chka.push(`${key}`);
                        choa.push(`${value}`);
                        chva.push(`${post[key]}`);
                      }
                    }
                    for (var i = 0; i < chka.length; i++) {
                      // INSERT INTO changes (type,location,id,field,old,timestamp) VALUES ('init','nowhere','0','nofield','',NOW());
                      let logquery = "INSERT INTO changes (type,location,id,field,old,timestamp)";
                      logquery += " VALUES ('edit','" + post.table + "','" + post.uuid + "','" + chka[i] + "','" + choa[i] + "',NOW());";
                      let resultcount = 0;
                      console.log(logquery);
                      db.query(logquery, function (err1, result1, fields1) {
                        resultcount++;
                        console.log("Logged " + resultcount + " change" + (resultcount > 0) ? "s" : "");
                      });
                    }
                    if(chka.length > 0) {
                      let chquery = "UPDATE " + post.table + " SET " + chl + " WHERE " + post.field + " LIKE '" + post.uuid + "';";
                      console.log(chquery);
                      db.query(chquery, function (err2, result2, fields2) {
                        res.end("Changes saved");
                        console.log("Done");
                      });
                    } else {
                      console.log("No changes");
                    }
                  }
                  // res.end(stringifyMySQLResponse(result, fields));
                });
              } else {
                res.end("Please include table and field");
              }
            } break; // End edit
            case "auth": {
              let token = "authtoken4" + post.username;
              tokens.set(token, {username: post.username, rank: 4});
              res.end(token);
              console.log("Auth attempt as " + post.username + " with token " + token);
            } break;
            case "deauth": {
              let token = post.token;
              if(tokens.has(token)) {
                tokens.delete(token);
                res.end(token);
                console.log("Auth attempt as " + post.username + " with token " + token);
              } else {
                res.end("Not authed, so can not deauth");
              }
            }
            default: {
              res.end("Invalid action specified");
              for (let [key, value] of Object.entries(post)) {
                console.log(`${key}:${value}`);
              }
            } break;
          } // End post requests
          } else {
            res.end("No POST action specified");
          }
        } else {
          res.end("Connection killed because payload was too large.");
        }
      });
    } else { // Get requests
      console.log("Action: " + args.action);
      console.log(req.url);
      console.log("Got HTTP request");
      res.writeHead(200, {'Content-Type': 'text/html'});
      switch(args.action) { // Start get requests
      // case "read": {
      //   if(isDBConnected && !(args.key === undefined) && !(args.value === undefined) && !(args.fields === undefined)) {
      //     console.log("Find: " + args.key + "='" + args.value + "'");
      //     // IMPORTANT TODO sanatize key
      //     // IMPORTANT TODO sanatize fields
      //     let query = "SELECT " + args.fields + " FROM people WHERE " + args.key + " LIKE '" + args.value + "';";
      //     console.log(query);
      //     db.query(query, function (err, result, fields) {
      //       res.end(stringifyMySQLResponse(result, fields));
      //     });
      //   } else {
      //     res.end("DB not connected or no name specified");
      //   }
      // } break;
      case "fields": {
        if(isDBConnected) {
          if(defined(args.table)) {
            let query = "SHOW COLUMNS FROM " + args.table + ";";
            console.log(query);
            db.query(query, function (err, result, fields) {
              res.end(stringifyMySQLResponse(query, result, fields));
            });
          } else {
            console.log("Missing args " + args.table);
            res.end("Missing required args");
          }
        } else {
          console.log("DB not connected yet!");
          res.end("DB not connected");
        }
      } break;
      case "view": {
        if(isDBConnected) {
          // if(!(args.uuid === undefined)) {
          if(defined(args.table, args.key, args.value)) {
            if(!defined(args.fields)) {
              args.fields = "*";
            }
            // Possibly should replace 'like' with '=' if thing try to get too slow when 'like' is not needed
            let query = "SELECT " + args.fields + " FROM " + args.table + " WHERE " + args.key + " LIKE '" + args.value + "';";
            console.log(query);
            db.query(query, function (err, result, fields) {
              res.end(stringifyMySQLResponse(query, result, fields));
            });
          } else {
            res.end("Missing required args");
          }
        } else {
          res.end("DB not connected");
        }
      } break;
      default: {
        res.end("No GET action specified");
      } break;
      } // End get requests
    }
  } break; // End db section
  case "": {
    console.log("Got HTML request");
    sendFile(res, "text/html", "frontend.html");
  } break;
  default: {
    console.log("Got unknown request");
    console.log("Loading " + req.url);
    // path = req.url.substr(1, req.url.indexOf('?')-1);
    if(path.substr(path.indexOf("."), path.length) == ".js") {
      sendFile(res, "text/javascript", path);
    } else {
      sendFile(res, "text/html", path);
    }
  } break;
  }
}).listen(12345);
