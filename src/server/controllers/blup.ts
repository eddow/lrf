//'blup' is a cute name for "spy the customer"
export default function opening(app, io, session, store) {
	const sockets = io.of('/');
	sockets.on('connection', function(socket) {
		debugger;
		socket.on('blup', ({action, infos})=> {
			store.create('logs', {
				sessionId: socket.handshake.session.session.id,
				timestamp: (new Date()).getTime(),
				action, infos
			})
		});
	});
}