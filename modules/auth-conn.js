const { alert } = require('./utils');

const isUser = (req, res, next) => {
  // if(req.session && req.session.user) next();
  if(req.isAuthenticated()) next();
  else {
     res.send(alert('회원만 사용하실 수 있습니다. 로그인 해주세요', '/'));
  }
  console.log('hi~~~~~~~~~');
  // next();
  // next();
}

const isGuest = (req, res, next) =>{
  // if(!req.session.user) next();
  if(!req.isAuthenticated()) next();
  else{
    res.send(alert('정상적인 접근이 아닙니다. 로그아웃 이후에 사용하세요', '/board'));
  }
}

const isGrant2 = (req, res, next) =>{
  // if(req.session && req.session.user && req.session.user.grant >= 2) next();
  if(req.isAuthenticated() && req.session.user.grant >= 2) next();
  else{
    res.send(alert('정상적인 접근이 아닙니다. 로그아웃 이후에 사용하세요', '/board'));
  }
}

module.exports = { isUser, isGuest, isGrant2 };

