const express = require('express');
const app = express();
require('dotenv').config();

const path = require('path');
const createError = require('http-errors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

/* 불러옴과 동시에 session 전달 */
// const mySQLSession = require('express-mysql-session')(session);
const { pool } = require('./modules/mysql-conn');

const { alert } = require('./modules/utils.js');
const passport = require('passport');

/* index 가져옴 */
const passportModule = require('./passport');

app.use((req,res,next)=>{
  //console.log('hi~');
  next();
})



/* Server */
app.listen(process.env.PORT||3000, ()=>{
  console.log('http://127.0.0.1:' + process.env.PORT);
});

/* Setting */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.locals.pretty = true;

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/storage', express.static(path.join(__dirname, './upload')));

/* Session */
// const sessionStore = new mySQLSession({}, pool);

/* 앞으로 쿠키는 모두 암호화 시키겠다 */
app.use(cookieParser(process.env.PASS_SALT))

/* request 에 session 객체 생성 */
app.use(session({
  key : 'node-board',
  secret : process.env.PASS_SALT,
  resave : false, // 한번 save 한걸 다시 save 하겠다
  saveUninitialized : false,
  cookie : {
      httpOnly : true,
      secure : process.env.SERVICE === 'production' ? true : false, // https > 개발모드에서 false, production 할때는 true
    },
  })
);

passportModule(passport);
app.use(passport.initialize());
app.use(passport.session());

/* Router */
const boardRouter = require('./routes/board');
const userRouter = require('./routes/user');
app.use('/board', boardRouter);
app.use('/user',userRouter);
app.use('/', (req,res,next)=>{
  res.redirect('/user/login');
});

/* 예외처리 */
app.use((req, res, next)=>{
  // next('message');
  next(createError(404));
})
app.use((err, req, res, next)=>{
  // res.send(err);
  // res.send(err.message + err.status);
  // locals > view engine 이 갖고있는 전역변수
  res.locals.message = err.message;
  if(err.message == 'File too large') res.send(alert('업로드 용량을 초과하였습니다.', '/board/list'));
  else{
    res.locals.status = (err.status || 500) + "error";
    res.render('error');
  }
})