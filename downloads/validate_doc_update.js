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

  // admins can do ANYTHING (even break stuff)
  try {
    if (!isAdmin()) 
      assert(false, "only admin can change the db")
  } catch (er) {
    assert(false, "failed checking admin-ness")
  }



  assert(!doc._deleted, "deleting docs directly not allowed.\n" +
                        "Use the _update/delete method.")

  assert(doc.name === doc._id, "name must match _id")
  assert(doc.name.length < 512, "name is too long")



  function isAdmin () {
    if (dbCtx &&
        dbCtx.admins) {
      // is in admins.names
      if (dbCtx.admins.names &&
          dbCtx.admins.roles &&
          Array.isArray(dbCtx.admins.names) &&
          dbCtx.admins.names.indexOf(user.name) !== -1) return true
      // is in admins.roles
      if (Array.isArray(dbCtx.admins.roles)) {
        for (var i = 0; i < user.roles.length; i++) {
          if (dbCtx.admins.roles.indexOf(user.roles[i]) !== -1) return true
        }
      }
    }
    // admin _roles
    return user && user.roles.indexOf("_admin") >= 0
  }

}
