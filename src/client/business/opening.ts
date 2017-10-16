import * as io from 'socket.io-client'
import {observeDeeply} from './data'
import {put} from 'axios'
import * as alertify from 'alertify'

const open: any = {opened: true};
export default open;
observeDeeply(open);
open.set = set;
const socket = io('/');
socket.on('opening', function(opened) {
	open.opened = opened;
});
function set(opened) {
	if(undefined=== opened) opened = !open.opened;
	put('/open/', {
		opened
	}).then(()=> {}, response=> {
		alertify.error('Il faut vous ré-identifier');
	});
}