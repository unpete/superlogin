var path = require('path');

// These are the default settings that will be used if you don't override them in your config
module.exports = {
  security: {
    defaultRoles: ['doc_editor'],
    maxFailedLogins: 4,
    lockoutTime: 300,
    sessionLife: 86400,
    tokenLife: 86400,
    loginOnRegistration: false,
    loginOnPasswordReset: false
  },
  local: {
    usernameField: 'username',
    passwordField: 'password'
  },
  session: {
    adapter: 'memory',
    file: {
      sessionsRoot: '.sessions'
    }
  },
  dbServer: {
    protocol: 'http://',
    host: 'cou206:5984',
    designDocDir: path.join(__dirname, '/designDocs'),
    userDB: 'sl_users',
    // CouchDB's _users database. Each session generates the user a unique login and password. This is not used with Cloudant.
    couchAuthDB: '_users'
  },
  emails: {
    confirmEmail: {
      subject: 'Подтверждение email',
      template: path.join(__dirname, '../templates/email/confirm-email.ejs'),
      format: 'text'
    },
    forgotPassword: {
      subject: 'Сброс пароля',
      template: path.join(__dirname, '../templates/email/forgot-password.ejs'),
      format: 'text'
    }
  }
};
