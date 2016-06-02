var Reflux = require("reflux");
var request = require("superagent");

var actions = {
    setUsername: Reflux.createAction(),
    setGists: Reflux.createAction()
};

var GithubStore = Reflux.createStore({

    username: false,
    gists: [],

    init: function () {
        this.listenTo(actions.setUsername, this.setUsername);
        this.listenTo(actions.setGists, this.setGists);
    },

    setUsername: function (username) {
        this.username = username;
        this.loadGists();
        this.trigger();
    },

    loadGists: function () {
        var self = this;

       /* request
          .get('https://api.github.com/users/' + this.username + '/gists')
          .set('Accept', 'application/json')
          .end(function (res) {
              if (res.ok) {
                  self.setGists(res.body);
              }
          });*/
    },

    setGists: function (gists) {
        this.gists = gists;
        this.trigger();
    },

    getUsername: function () {
        return this.username
    },

    getGists: function () {
        return this.gists;
    }
});

module.exports = {
    actions: actions,
    store: GithubStore
};