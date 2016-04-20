var mongoose     = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

	var Schema = mongoose.Schema;

	var userSchema = new Schema({
       
        local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photoUrl     : String,
        gender       : String
    }
	});
    
    
    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.local.password);
    };
    
    
	// /Statics
	var User = mongoose.model('User', userSchema);

module.exports = User;