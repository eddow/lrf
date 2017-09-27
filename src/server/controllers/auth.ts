import {Router} from 'express'
const auth = new Router();
export default auth;

auth.route('/login').post(login);
auth.route('/logout').post(logout);
auth.route('/register').post(register);

function login(req, res) {
	res.status(200).send({
		admin: true,
    access_token: 'eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBkb21haW4uY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiYWxnIjoiSFMyNTYifQ.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBkb21haW4uY29tIiwibmFtZSI6IkpvaG4gRG9lIn0.CyXHbjCBjA4uLuOwefCGbFw1ulQtF-QfS9-X0fFUCGE'
  });
}

function logout(req, res) {
	res.status(200).send();
}

function register(req, res) {
	res.status(500).send();
}