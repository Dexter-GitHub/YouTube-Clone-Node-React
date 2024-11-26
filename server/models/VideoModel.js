const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User',    // User Model에서 데이터 가져옴
        required: true  // 필수 입력하도록 허용
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }
 }, { timestamps: true })   // 생성 날짜 표시

const Video = mongoose.model('Video', videoSchema);

// 다른곳에서 사용할 수 있도록 함
module.exports = { Video }
