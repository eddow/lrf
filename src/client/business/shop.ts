import * as axios from 'axios'
export function buyProducts(products, contact, success, failure) {
	console.log(products);
	console.log(contact);
	axios.post('/customer', {products, contact}).then(success, failure);
}
