YUI.add('todo-list', function(Y) {

    var LocalStorage = Y.ToDo.LocalStorage;
    var Item = Y.ToDo.Item;

    var List = Y.Base.create('list', Y.ModelList, [], {
	model: Item,

	sync: LocalStorage('todo'),

	done: function() {
	    return Y.Array.filter(this.toArray(), function(model) {
		return model.get('done');
	    });
	},

	remaining: function() {
	    return Y.Array.filter(this.toArray(), function(model) {
		return !model.get('done');
	    });
	}
    });

    Y.namespace('ToDo').List = List;
    
}, '0.0.1', {
    requires: [
	'model-list'
    ]
});