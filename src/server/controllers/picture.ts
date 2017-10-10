import {Router} from 'express'
import * as dataurl from 'dataurl'

export default function picture(store) {
	const picture = new Router();

	picture.route('/:id')
		.get(download);
	return picture;

	async function download(req, res) {
		var id = req.params.id, dish = await store.find('dish', id);
		if(!dish)
			return res.status(404).send();
		if(!dish.picture)
			return res.status(200).send();
		var parsed = dataurl.parse(dish.picture);
		res.set('Content-Type', parsed.mimetype);
		//if(parsed.charset)
		res.status(200).send(parsed.data);
	}
}