YUI().add('todo-app', function(Y) {

    var ToDo     = Y.ToDo;
    var Item     = ToDo.Item;
    var List     = ToDo.List;
    var ItemView = ToDo.ItemView;


    var ToDoApp = function(options) {
	options.container = options.container || '#todo-app';
	options.inputNode = options.inputNode || '#new-todo';
	options.list = options.list || '#todo-list';
	options.stats = options.stats || '#todo-stats';

	var events = {
	    '.todo-clear': {
		click: 'clearDone'
	    },
	    
	    '.todo-item': {
		mouseover: 'hoverOn',
		mouseout: 'hoverOff'
	    }
	};

	events[options.inputNode] = { keypress: 'createTodo' };
	
	var ToDoAppView = Y.Base.create('todoApp', Y.View, [], {
	    container: Y.one(options.container),

	    inputNode: Y.one(options.inputNode),

	    template: Y.one('#todo-stats-template').getContent(),

	    events: events,

	    initializer: function() {
		var list = this.todoList = new List();

		list.after('add', this.add, this);
		list.after('reset', this.reset, this);

		list.after(['add', 'reset', 'remove', 'item:doneChange'],
			   this.render, this);

		list.load();
	    },

	    render: function() {
		var todoList = this.todoList;
		var stats = Y.one(options.stats);
		var numRemaining;
		var numDone;

		if (todoList.isEmpty()) {
		    stats.empty();
		    return this;
		}

		numDone = todoList.done().length;
		numRemaining = todoList.remaining().length;

		stats.setContent(Y.Lang.sub(this.template, {
		    numDone: numDone,
		    numRemaining: numRemaining,
		    doneLabel: numDone === 1 ? 'task' : 'tasks',
		    remainingLabel: numRemaining === 1 ? 'task' : 'tasks'
		}));

		if (!numDone) {
		    stats.one('.todo-clear').remove();
		}

		return this;
	    },

	    add: function(e) {
		var view = new ItemView({model: e.model});
		Y.one(options.list).append(view.render().container);
	    },

	    clearDone: function(e) {
		var done = this.todoList.done();

		e.preventDefault();

		this.todoList.remove(done, {silent: true});

		Y.Array.each(done, function(item) {
		    item.destroy({'delete': true});
		});

		this.render();
	    },

	    createTodo: function(e) {
		var value;

		if (e.keyCode === 13) {
		    value = Y.Lang.trim(this.inputNode.get('value'));

		    if (!value) {
			return;
		    }

		    this.todoList.create({text: value});

		    this.inputNode.set('value', '');
		}
	    },

	    hoverOff: function(e) {
		e.currentTarget.removeClass('todo-hover');
	    },

	    hoverOn: function(e) {
		e.currentTarget.addClass('todo-hover');
	    },

	    reset: function(e) {
		var fragment = Y.one(Y.config.doc.createDocumentFragment());

		Y.Array.each(e.models, function(model) {
		    var view = new ItemView({model: model});
		    fragment.append(view.render().container);
		});

		Y.one(options.list).setContent(fragment);
	    }
	});

	return new ToDoAppView();
    };

    Y.namespace('ToDo').App = ToDoApp;
    
    
}, '0.0.1', {
    requires: [
	'view',
	'event-focus',
	'todo-storage',
	'todo-item',
	'todo-list',
	'todo-item-view'
    ]
});