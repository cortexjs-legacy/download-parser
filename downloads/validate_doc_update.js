module.exports = function (doc, oldDoc, user, dbCtx) {

  if (typeof console === "object") {
    var d = console.error
  } else {
    var d = function() {}
  }

  function assert (ok, message) {
    if (!ok) throw {forbidden:message}
    d("pass: " + message)
  }

  // can't write to the db without logging in.
  if (!user || !user.name) {
    throw { forbidden: "Please log in before writing to the db" }
  }

  try {
    require("monkeypatch").patch(Object, Date, Array, String)
  } catch (er) {
    assert(false, "failed monkeypatching")
  }

  if(doc._deleted) return; // do not check delete

  assert(doc.name === doc._id, "name must match _id")
  assert(doc.name.length < 512, "name is too long")

}
