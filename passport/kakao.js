const KakaoStrategy = require('passport-kakao').Strategy;
const { pool } = require('../modules/mysql-conn');

const cb = async (accessToken, refreshToken, profile, done) => {
	console.log(profile);
	let sql, result;
	let user = {
    api : profile.provider,
		id : profile.id,
		username: profile.username,
		// email: profile._json.kakao_account.email
	}
	sql = "SELECT * FROM user WHERE api=? AND api_id=?";
	result = await pool.execute(sql, [user.api, user.id]);
	if(!result[0][0]) {
    sql = "INSERT INTO user SET username=?, api=?, api_id=?";
    result = await pool.execute(sql, [user.username, user.api ,user.id]);
    sql = "SELECT * FROM user WHERE api=? AND api_id=?";
	  result = await pool.execute(sql, [user.api, user.id]);
  }
  done(null, result[0][0]);
}

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    // clientSecret: clientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
    clientID : process.env.KAKAO_KEY,
    callbackURL : '/user/kakao/cb'
  },cb));
};