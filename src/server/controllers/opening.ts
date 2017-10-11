export var isOpened = false;
import * as sharedsession from 'express-socket.io-session'
//TODO: horaire automatique
export default function opening(app, io, session) {
	const openns = io.of('/opening');
	openns.use(sharedsession(session, {
		autoSave:true
	}));
	openns.on('connection', function(socket) {
		socket.emit('opening', isOpened);
		socket.on('opening', opened=> {
			const user = socket.handshake.session.user;
			if (user && user.admin) {
				if(isOpened !== opened) {
					console.log(opened?'We are opened!':'We are closed!')
					isOpened = opened;
					openns.emit('opening', opened);
				}
			}
		});
	});
}