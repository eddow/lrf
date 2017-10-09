import * as pdf from 'html-pdf'
var options = {
	format: 'A4',
	orientation: "portrait"
};

export default function pdfGen(html) {
	return new Promise((resolve, reject)=> {
		pdf.create(html).toBuffer(function(err, buffer){
			if(err) reject(err);
			else resolve(buffer);
		});
	});
}