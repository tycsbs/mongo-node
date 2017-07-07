var express = require('express');
var app = express();
var User = require('../database/model/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    User.fetch(function (err, users) {
        if (err) console.log(err);
        var _user = req.session.user
        if(_user){
            res.locals.user = _user
        }
        res.render('users', {
            title: "用户列表",
            users: users
        });
    })

});
router.post('/signup', function (req, res) {
    var _user = req.body.user;
    User.findOne({name: _user.name}, function (err, user) {
        if (err) console.log("error!")
        if (user) {
            console.log('用户已存在')
            res.redirect('/users')
        } else {
            var newuser = new User(_user)
            newuser.save(function (err) {
                if (err) console.log("error")
                console.log("注册成功")
                res.redirect('/users')
            })
        }
    })
})

router.post('/signin', function (req, res) {
    var _user = req.body.user
    var name = _user.name
    var password = _user.password
    User.findOne({name: name}, function (err, user) {
        if (err) return console.log(err)
        user.comparePassword(password, function (err, isMatch) {
            if (isMatch) {
                req.session.user = user
                console.log("登录成功")
                res.redirect('/users')
            } else {
                console.log("登录失败，密码错误！")
            }
        })
    })
})
router.get('/logout',function(req,res){
    delete req.session.user;
    res.redirect('/users')
})

module.exports = router;