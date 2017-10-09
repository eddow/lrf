import {join} from 'path'
import * as pdf from 'html-pdf'
var options = {
	format: 'A4',
	orientation: "portrait",
	base: join(__dirname, '../../assets')
};

export default function pdfGen(html) {
	return new Promise((resolve, reject)=> {
		pdf.create(html, options).toBuffer(function(err, buffer){
			if(err) reject(err);
			else resolve(buffer);
		});
	});
}