import * as axios from 'axios'
import {observeDeeply} from 'biz/data'

export const status = observeDeeply({loaded: false});
export const menus = [];
export const dishes = {};

axios('/customer/today').then(response=> {
	menus.push(...response.data);
	for(let service of response.data)
		for(let dish of service.dishes)
			dishes[dish._id] = dish;
	status.loaded = true;
});