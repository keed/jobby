const mongoose = require('mongoose');
const Schema = mongoose.Schema

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema ({
  email : {
    type : String,
    unique : true,
    required : [true, 'Email Required']
  },
  password : {
    type : String,
    required : [true, 'Password Required']
  },
  firstName : {
    type : String,
    required : [true, 'First Name Required']
  },
  lastName : {
    type : String,
    required : [true, 'Last Name Required']
  },
  userName : {
    type : String,
    required : [true, 'Username Required']
  }
})

userSchema.methods.validPassword = function(candidatePassword) {
      return bcrypt.compareSync(candidatePassword, this.password);
};

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model('User', userSchema)
module.exports = User
