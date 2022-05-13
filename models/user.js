const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});


// call the .pre() method on UserSchema which takes a callback
// it fires before (pre-) the action you pass as the first argument (in this case, save) 
userSchema.pre('save', function(next) {
    let user = this;
  
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) return next(err);
  
      user.password = hash;
      next();
    })
});

userSchema.statics.authenticate = function(username, password, next) {
    User.findOne({ username: username })
      .exec(function (err, user) {
        if (err) {
          return next(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return next(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return next(null, user);
          } else {
            return next();
          }
        });
      });
}

const User = mongoose.model('User', userSchema);
module.exports = User;