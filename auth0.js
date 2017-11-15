const passport = require('passport');
const assert = require('assert');
const Auth0Strategy = require('passport-auth0').Strategy;


exports.init = function(config) {
  assert(config.app, 'Expected auth0 config to have app');
  assert(config.db, 'Expected auth0 config to have db')
  assert(config.domain, 'Expected auth0 config to have domain');
  assert(config.clientID, 'Expected auth0 config to have client ID');
  assert(config.clientSecret, 'Expected auth0 config to have client secret');

  config.successRedirect = config.successRedirect || '/';
  config.failureRedirect = config.failureRedirect || '/';
  config.logoutRedirect = config.logoutRedirect || '/';
  
  const {app, db} = config;

  app.use(passport.initialize());
  app.use(passport.session());


  passport.use(new Auth0Strategy({
    domain: config.domain,
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: '/auth/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    db.users.findOne({auth_id: profile.id}, (err, user) => {
      if (!user) {
        db.users.insert({auth_id: profile.id, username: profile.displayName}, (err, user) => {
          return done(err, user);
        })
      } else {
        return done(err, user);
      }
    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.auth_id);
  });

  passport.deserializeUser(function(id, done) {
    db.users.findOne({auth_id: id}, (err, user) => {
      done(err, user);
    })
  })


  /**
   * ROUTES
   */
  app.get('/auth', passport.authenticate('auth0'))

  app.get('/auth/callback', passport.authenticate('auth0', {successRedirect: config.successRedirect, failureRedirect: config.failureRedirect}))


  app.get('/auth/me', (req, res) => {
    res.status(200).send(req.user);
  })

  app.get('/auth/logout', (req, res) => {
    req.logout();

    if (config.logoutRedirect) {
      res.redirect(config.logoutRedirect);
    } else {
      res.status(200).send('ok');
    }
  })
}