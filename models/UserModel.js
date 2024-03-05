const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  }, { timestamps: true });

  //static signup method
  userSchema.statics.register = async function(name, email, password){

    //bycrypt for password hashing
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new this({
          name: name,
          email: email,
          password: hashedPassword
        });
        await user.save();
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
  }
  
  module.exports = mongoose.model('User', userSchema);