var views = module.exports = exports = {}

views.groupTime = {
  map: function(doc) {
    function parse(s) {
      // s is something like "2010-12-29T07:31:06Z"
      s = s.split("T")
      var ds = s[0],
        ts = s[1],
        d = new Date()
        ds = ds.split("-")
        ts = ts.split(":")
        var tz = ts[2].substr(2)
      ts[2] = ts[2].substr(0, 2)
      d.setUTCFullYear(+ds[0])
      d.setUTCMonth(+ds[1] - 1)
      d.setUTCDate(+ds[2])
      d.setUTCHours(+ts[0])
      d.setUTCMinutes(+ts[1])
      d.setUTCSeconds(+ts[2])
      d.setUTCMilliseconds(0)
      return d.getTime()
    }

    Array.prototype.forEach = Array.prototype.forEach || function forEach(fn) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (this.hasOwnProperty(i)) {
          fn(this[i], i, this)
        }
      }
    }

    if (doc.daysDownload && doc.daysDownload.length) {
      var name = doc._id;
      doc.daysDownload.forEach(function(day) {
        var t = new Date(parse(day.time))
        emit([t.getTime(), name], day.count)
      })
    }

    
  },
  reduce: "_sum"
}


views.downloads = {
  map: function(doc) {

    function parse(s) {
      // s is something like "2010-12-29T07:31:06Z"
      s = s.split("T")
      var ds = s[0],
        ts = s[1],
        d = new Date()
        ds = ds.split("-")
        ts = ts.split(":")
        var tz = ts[2].substr(2)
      ts[2] = ts[2].substr(0, 2)
      d.setUTCFullYear(+ds[0])
      d.setUTCMonth(+ds[1] - 1)
      d.setUTCDate(+ds[2])
      d.setUTCHours(+ts[0])
      d.setUTCMinutes(+ts[1])
      d.setUTCSeconds(+ts[2])
      d.setUTCMilliseconds(0)
      return d.getTime()
    }

    Array.prototype.forEach = Array.prototype.forEach || function forEach(fn) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (this.hasOwnProperty(i)) {
          fn(this[i], i, this)
        }
      }
    }

    if (doc.daysDownload && doc.daysDownload.length) {
      var name = doc._id;
      doc.daysDownload.forEach(function(day) {
        var t = new Date(parse(day.time))
        emit([name, t.getTime()], day.count)
      })
    }
  },
  reduce: "_sum"
}

