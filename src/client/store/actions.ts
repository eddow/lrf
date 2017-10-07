import * as types from './mutation-types'

export const addToCart = ({ commit }, description) => {
	commit(types.ADD_TO_CART, description);
}
