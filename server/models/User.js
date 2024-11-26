const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ) {
    var user = this;
    
    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
    
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
    
                user.password = hash
                next()
            })
        })
    }
    else {
        next()
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {    
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = async function (cb) {
    var user = this;
    console.log('user',user)
    console.log('userSchema', userSchema)

    // jsonwebtoken을 이용해서 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secret')
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    try {
        const savedUser = await user.save();
        cb(null, savedUser);
    } catch (err) {
        cb(err)
    }      
}

userSchema.statics.findByToken = async function(token, cb) {
    var user = this;
    
    try {
        // 토큰을 decode 한다.
        const decode = jwt.verify(token, 'secret');

        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        const foundUser = await user.findOne({ "_id": decode, "token": token });        
        return foundUser;
    } catch (err) {
        cb(err);
    }
}

const User = mongoose.model('User', userSchema)

// 다른곳에서 사용할 수 있도록 함
module.exports = { User }
