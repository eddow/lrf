import {Router} from 'express'
const auth = new Router();
export default auth;

auth.route('/login').post(login);
auth.route('/logout').post(logout);
auth.route('/register').post(register);

function login(req, res) {
	var user = req.body;
	if('qwe'=== user.email && 'qwe'=== user.password) {
		var token = {
			admin: true,
			access_token: 'eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBkb21haW4uY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiYWxnIjoiSFMyNTYifQ.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBkb21haW4uY29tIiwibmFtZSI6IkpvaG4gRG9lIn0.CyXHbjCBjA4uLuOwefCGbFw1ulQtF-QfS9-X0fFUCGE'
		};
		req.session.user = {admin: true};
		req.session.save(err=> res.status(err?500:200).send(err||token))
	} else res.status(401).send('no');
}

function logout(req, res) {
	req.session.user = null;
	req.session.save(err=> res.status(err?500:200).send());
}

function register(req, res) {
	res.status(500).send();
}