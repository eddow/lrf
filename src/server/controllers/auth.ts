import {Router} from 'express'
const auth = new Router();
export default auth;

auth.route('/login').post(login);
auth.route('/logout').post(logout);
auth.route('/register').post(register);

function login(req, res) {
	res.status(200).send({admin: true});
}

function logout(req, res) {
	res.status(200).send();
}

function register(req, res) {
	res.status(500).send();
}