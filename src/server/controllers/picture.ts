//TODO:KILLME
import {Router} from 'express'
import * as Upload from 'upload-file'
import {join} from 'path'
import {path} from 'config'
import {statSync, removeSync, ensureDir, existsSync, moveSync} from 'fs-extra'
const modPostFix = '-mod'
export default function picture(store) {
	const picture = new Router();

	picture.route('/:id')
		.post(upload)
		.get(download);
	
	store.on('afterUpdate', function(collection, id) {
		var dest = path.pictures, org = join(dest, id+modPostFix), dst = join(dest, id);
		if(existsSync(org)) {
			removeSync(dst);
			moveSync(org, dst);
		}
	});
	store.on('afterDestroy', function(collection, id) {
		var dest = path.pictures, org = join(dest, id+modPostFix), dst = join(dest, id);
		if(existsSync(org)) removeSync(org);
		if(existsSync(dst)) removeSync(dst);
	});

	return picture;
	
	function upload(req, res) {
		console.log(req.params);
		var dest = path.pictures;
		ensureDir(dest);
		var upload = new Upload({
			dest,
			rename: function(name, file) {
				return req.params.id+modPostFix;
			}
		});

		upload.on('end', function(fields, files) {
			res.status(200).send('ok')
		});

		upload.on('error', function(err) {
			console.error(err);
			res.status(500).send(err);
		});

		upload.parse(req);
	}

	function download(req, res) {
		var id = req.params.id;
		store.find('Dish', id).then(dish=> {
			res.download(join(path.pictures, req.params.id), dish.picture);
		});
	}
}