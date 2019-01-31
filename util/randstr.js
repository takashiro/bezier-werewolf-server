
const CHARS = '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./ ~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?';

/**
 * Generate a random key
 * @param {number} length
 * @param {string} chars Possible characters, default to all printable characters
 * @return {string}
 */
function randstr(length, chars = CHARS) {
	let str = [];
	for (let i = 0; i < length; i++) {
		str.push(chars[Math.floor(Math.random() * chars.length)]);
	}
	return str.join('');
}

module.exports = randstr;
