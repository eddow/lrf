import {shipping} from 'config'

export default function cost(price) {
	return Math.max(0, Math.min(shipping.cost, shipping.under-price));
}