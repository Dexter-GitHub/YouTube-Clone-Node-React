const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const dislikeSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }
 }, { timestamps: true })   // 생성 날짜 표시

const Dislike = mongoose.model('Dislike', dislikeSchema);

// 다른곳에서 사용할 수 있도록 함
module.exports = { Dislike }
