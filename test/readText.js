
/**
 * Read text from a stream
 * @param {Stream} stream
 * @return {Promise<object>} JSON Object
 */
function readText(stream) {
	return new Promise(function (resolve, reject) {
		let body = [];
		stream.on('data', chunk => body.push(chunk));
		stream.on('error', reject);
		stream.on('end', function () {
			let text = Buffer.concat(body).toString();
			try {
				resolve(text);
			} catch (error) {
				console.error('Failed to parse: ' + json);
				reject(error);
			}
		});
	});
}

module.exports = readText;
