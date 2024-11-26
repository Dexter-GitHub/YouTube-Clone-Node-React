const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { auth } = require('../middleware/auth');

router.get('/', (req, res) => {
    res.send('Hello World!!!~');
})

router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

router.post('/register', (req, res) => {
    // 회원 가입 할때 필요한 정보들을 clinet에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    user.save()
        .then(() => {
            return res.status(200).json({ success: true });
        })    
        .catch(err => {
            return res.json({ success: false, err });
        })
});

router.post("/login", async (req, res) => {
    try {
        console.log("hello");
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })            
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                res.cookie("w_authExp", user.tokenExp);
                res.cookie("w_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id });
            })
        })
    } catch (error) {
        res.status(500).json({ loginSuccess: false, err});
    }
});

router.get('/logout', auth, async (req, res) => {
    try {
        console.log(req.user);
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { token: "", tokenExp: "" }
        );

        if (!user) {
            return res.status(404).json(
                { success: false, message: "User not found" }
            );
        }

        return res.status(200).send({
            success: true
        })
    } catch (err) {
        return res.status(500).json({ success: false, err });
    }
});

module.exports = router;
