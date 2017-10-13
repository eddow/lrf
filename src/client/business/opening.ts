import * as io from 'socket.io-client'
import {observeDeeply} from './data'
const open: any = {opened: true};
export default open;
observeDeeply(open);
open.set = set;
const socket = io('/opening');
socket.on('opening', function(opened) {
	open.opened = opened;
});
function set(opened) {
	if(undefined=== opened) opened = !open.opened;
	var x = socket.emit('opening', opened);
}