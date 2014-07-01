var views = module.exports = exports = {}

views.downloads = {
  map: function(doc) {
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
        emit([name, day.time], day.count)
      });
    }
  },
  reduce: "_sum"
}

