import {Router} from 'express'
export var isOpened = process.env.NODE_ENV !== 'production';	//In dev, it is opened by default when the server start
import {hours} from 'config'
import * as schedule from 'node-schedule'

export default function opening(io, session) {
	function hours2cron(h) {
		var hm = h.split(':');
		return hm[1]+' '+(Number(hm[0])+hours.tz)+' * * *';
	}
	schedule.scheduleJob(hours2cron(hours.open), function() { setOpened(true); });
	schedule.scheduleJob(hours2cron(hours.close), function() { setOpened(false); });

	const sockets = io.of('/');
	sockets.on('connection', function(socket) {
		socket.emit('opening', isOpened);
	});
	const opening = new Router();

	opening.route('/').put(setOpened);
	return opening;
	function setOpened(req, res) {
		debugger;
		console.log('opening...');
		const user = req.session.user;
		if (!user || !user.admin)
			return res.status(401).send();
		var opened = req.body.opened
		if(isOpened !== opened) {
			console.log(opened?'We are opened!':'We are closed!')
			isOpened = opened;
			sockets.emit('opening', opened);
		}
		res.status(209).send();
	}
}