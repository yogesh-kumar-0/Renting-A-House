const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new Schema({
   
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            default: "",
        },
        lastName: {
            type: String,
            default: "",
        },
        phone: {
            type: String,
            default: "",
        },
        profilePicture: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "",
        }
    });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);