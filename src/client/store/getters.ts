
import {dishes, status} from 'biz/daily'
function filtered(cart) {
	if(status.loaded) {
		var filtered = cart.added.filter(p=> !!dishes[p.product]);
		if(filtered.length !== cart.added.length)
		cart.added = filtered;
	}
	return cart.added
		.map(p=> ({
			product: dishes[p.product],
			quantity: p.quantity
		}));
}
export const cartProducts = state => {
	return filtered(state.cart);
}
export const cartQuantity = state=> filtered(state.cart).reduce(function(sum, poduct) {
  return sum + poduct.quantity;
}, 0)