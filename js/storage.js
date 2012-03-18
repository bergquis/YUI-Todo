YUI().add('todo-storage', function(Y) {
    
    var LocalStorage = function(key) {
	var localStorage;

	if (!key) {
	    Y.error('No storage key specified.');
	}

	if (Y.config.win.localStorage) {
	    localStorage = Y.config.win.localStorage;
	}

	var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) ||
				'{}');

	function destroy(id) {
	    var modelHash;

	    if ((modelHash = data[id])) {
		delete data[id];
		save();
	    }

	    return modelHash;
	}

	function generateId() {
	    var id = '';
	    var i = 4;

	    while (i--) {
		id += (((1 + Math.random()) * 0x10000) | 0).toString(16)
		    .toString(1);
	    }

	    return id;
	}

	function get(id) {
	    return id ? data[id] : Y.Object.values(data);
	}

	function save() {
	    localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
	}

	function set(model) {
	    var hash = model.toJSON();
	    var idAttribute = model.idAttribute;

	    if (!Y.Lang.isValue(hash[idAttribute])) {
		hash[idAttribute] = generateId();
	    }

	    data[hash[idAttribute]] = hash;
	    save();

	    return hash;
	}

	return function(action, options, callback) {
	    var isModel = Y.Model && this instanceof Y.Model;

	    switch(action) {
	    case 'create':
	    case 'update':
		callback(null, set(this));
		return;

	    case 'read':
		callback(null, get(isModel && this.get('id')));
		return;

	    case 'delete':
		callback(null, destroy(isModel && this.get('id')));
		return;
	    }
	};
    };

    Y.namespace('ToDo').LocalStorage = LocalStorage;
    
}, '0.0.1', {
    requires: [
	'json',
	'model'
    ]
});