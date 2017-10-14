export var isOpened = process.env.NODE_ENV !== 'production';	//In dev, it is opened by default when the server start
import * as sharedsession from 'express-socket.io-session'
import {hours} from 'config'
import * as schedule from 'node-schedule'

export default function opening(io, session) {
	function hours2cron(h) {
		var hm = h.split(':');
		return hm[1]+' '+(Number(hm[0])+hours.tz)+' * * *';
	}
	schedule.scheduleJob(hours2cron(hours.open), function() { setOpened(true); });
	schedule.scheduleJob(hours2cron(hours.close), function() {setOpened(false); });

	const openns = io.of('/opening');
	openns.use(sharedsession(session, {
		autoSave:true
	}));
	function setOpened(opened) {
		if(isOpened !== opened) {
			console.log(opened?'We are opened!':'We are closed!')
			isOpened = opened;
			openns.emit('opening', opened);
		}
	}
	openns.on('connection', function(socket) {
		socket.emit('opening', isOpened);
		socket.on('opening', opened=> {
			const user = socket.handshake.session.user;
			if (user && user.admin) {
				setOpened(opened);
			}
		});
	});
}