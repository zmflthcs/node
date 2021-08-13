const express=require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session=require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();
const passportConfig = require('./passport');
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const {sequelize} = require('./models');
const logger = require('./logger');

const helmet = require('helmet'); // this package help to fix vulnerability of server. but of course cannot cover all vulnerability.
const hpp = require('hpp')
const RedisStore= require('connect-redis')(session);
const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);


if(process.env.NODE_ENV==='production'){
    app.use(morgan('combined'))
    app.use(helmet());
    app.use(hpp());
} else{
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));


app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser('nodebirdsecret'));

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: 'nodebirdsecret',
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        pass: process.env.REDIS_PASSWORD,
        logErrors: true // show in console in case error occured in redis
    })
}

if(process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true
}
app.use(session(sessionOption));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/',pageRouter);
app.use('/auth',authRouter);
app.use('/post', postRouter);
app.use('user', userRouter);
app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    logger.info('hello');
    logger.error(err.message)
;    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), ()=> {
    console.log(app.get('port'), 'num port is active');
})