const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
 }, { timestamps: true })   // 생성 날짜 표시

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// 다른곳에서 사용할 수 있도록 함
module.exports = { Subscriber }
