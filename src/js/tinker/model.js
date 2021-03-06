// Chiel Kunkels (@chielkunkels)

// exposed
var tinker = {};

// private
var validFormat = {
	meta: {
		hash: "",
		revision: 0,
		title: "",
		description: "",
		created: ""
	},
	dependencies: {
		scripts: [""],
		styles: [""]
	},
	code: {
		markup: {
			type: "",
			body: ""
		},
		style: {
			type: "",
			body: ""
		},
		behaviour: {
			type: "",
			body: ""
		}
	}
};

/**
 * Attempt to fetch the tinker data from the dom and parse it
 * @return {Object, Boolean} The tinker data, or false if not found
 */
var parseData = function(){
	var el;
	if ((el = $('tinker-data')) !== null) {
		var data = el.get('text');
		try {
			var parsed = JSON.parse(data);
			return parsed;
		} catch(e) {
			console.warn('Failed to parse Tinker json data: '+e.message);
			return false;
		}
	}
};

/**
 * Validate a data structure against a valid tinker format
 * @param {Mixed} data The data to validate
 * @param {Mixed} compare The data to validate against
 * @return {Mixed} The filtered/validated data
 */
var validateData = function(data, compare){
	var valid = {};
	Object.each(data, function(value, key){
		if (key in compare) {
			valid[key] = typeOf(value) === 'object'
				? validateData(value, compare[key])
				: value;
		}
	});
	return valid;
};

/**
 * Check if a given key is valid
 * @param {String} key The path to validate
 */
var isValidPath = function(key){
	var path = key.split('.'), valid = validFormat, key;
	while (path.length) {
		key = path.shift();
		if (key in valid) {
			valid = valid[key];
		} else {
			return false;
		}
	}
	return true;
};

var parsed = parseData(), validated;
if (parsed) {
	validated = validateData(parsed, validFormat);
}

/**
 * Get data from the current tinker
 * @param {String} key The key to fetch
 * @return {Mixed} The data
 */
tinker.get = function(key){
	var path = key.split('.'), data = validated, key;
	while (path.length) {
		key = path.shift();
		if (data && key in data) {
			data = data[key];
		} else {
			data = undefined;
			break;
		}
	}
	return data;
};

/**
 * Set some new data into the tinker
 * @param {String} key The key to set
 * @param {Mixed} value The value to set
 */
tinker.set = function(key, value){
	if (!isValidPath(key)) {
		return false;
	}
	var path = key.split('.'), data = validated, k;
	while (path.length) {
		k = path.shift();
		if (!(k in data)) {
			data[k] = path.length ? {} : value;
		} else {
			data = data[k];
		}
	}
};

/**
 * Run the tinker
 */
tinker.run = function(){
	console.log('run tinker');
};

/**
 * Save the tinker
 */
tinker.save = function(){
	console.log('save tinker');
};

// export
module.exports = tinker;

