const express=require('express');
const { User, Post } = require('../models');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

router.get('/profile', isLoggedIn, (req,res,next)=> {
    res.render('profile', {title: 'my info - nodeBird', user: req.user});
})



router.get('/join', isNotLoggedIn, (req,res,next)=>{
    
    res.render('join',{
        title: 'register NodeBird',
        user: req.user,
        joinError: req.flash('joinError')
    })
})

router.get('/', async (req,res,next) => { 
    try{
    const posts = await Post.findAll({
        include:{
            model: User, // join with user who wrote these posts
            attributes: ['id', 'nick']
        },
        order: [['createdAt','DESC']]
    });
    
    res.render('main',{
        title: 'NodeBird',
        twits: posts,
        user: req.user,
        loginError: req.flash('loginError')
    })
    }catch(error){
        console.error(error);
        next(error);
    }
})

module.exports = router;