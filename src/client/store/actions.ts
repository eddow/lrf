import * as types from './mutation-types'

export const addToCart = ({ commit }, product, quantity) => {
	commit(types.ADD_TO_CART, {
		id: product._id,
		quantity
	});
}
