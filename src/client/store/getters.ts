export const cartProducts = state => state.cart.added;

export const cartQuantity = state=> state.cart.added.reduce(function(sum, poduct) {
  return sum + poduct.quantity;
}, 0)