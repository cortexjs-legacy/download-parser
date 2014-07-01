#!/usr/bin/env node

var path = require('path');
var moment = require('moment');
var split = require('split');
var concat = require('concat-stream');


var env = process.NODE_ENV || "development";

var config = require(path.join(__dirname, './config.' + env));

var downloads = require('couch-db')(config.url).database('downloads');

process.stdin.pipe(split(function(line) {
  var m = /\[(.*)\] (.*)/.exec(line);
  
  if(m) {
    var time = new Date(moment(m[1], 'DD-MMM-YYYY').startOf('day').format());
    var pkg = /\/([a-z0-9-\.]+)\/-\/([a-z0-9-\.]+)\.tgz/.exec(m[2]);
    if(pkg) {
      var name = pkg[1];
      var version = pkg[2].substring(name.length+1);
      return {time: time, name: name};
    }
  }

  return undefined;
})).pipe(concat(function(ary) {
  
  var rows = ary.filter(Boolean);
  var data = {};
  rows.forEach(function(r) {
    var a = data[r.name] = data[r.name] || {};
    a[r.time] = a[r.time] || 0;
    a[r.time] += 1;
  });
  
  var rs = {};
  for(var name in data) {
    var daysDownload = [];
    var a = data[name];
    Object.keys(a).forEach(function(time) {
      daysDownload.push({
        time: time,
        count: a[time]
      });
    });

    rs[name] = daysDownload;
  }


  downloads.mfetch(Object.keys(data), function(err, docs) {
    if(err) {
      console.error(err);
      return;
    }
    
    var updates = [];
    var news = docs.filter(function(d) {
      return !d.doc;
    });
    
    news.forEach(function(n) {
      var name = n.key;
      updates.push({
        _id: name,
        name: name,
        daysDownload: rs[name]
      });
    });

    docs = docs.map(function(d) {
      return d.doc;
    }).filter(Boolean);


    docs.forEach(function(doc) {
      if(doc) {
        var nd = rs[doc._id];
        nd.forEach(function(t) {
            var time = t.time;
          var cnt = t.count;
          
          var found = false;
          for(var i = 0; !found && i < doc.daysDownload.length; i++) {
            var od = doc.daysDownload[i];
            if(od.time == time) {
              found = true;
              od.count += cnt;
              break;
            }
          }
          
          if(!found) 
            doc.daysDownload.push(t);
          
          updates.push(doc);
        });
      }
    });

    
    downloads.bulkSave(updates, function(err) {
      if(err)
        console.error(err);
      console.log('done');
    });
  });
}));


