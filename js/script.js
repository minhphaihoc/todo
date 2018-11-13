/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	}
	Element.prototype.closest = function (s) {
		var el = this;
		var ancestor = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (ancestor.matches(s)) return ancestor;
			ancestor = ancestor.parentElement;
		} while (ancestor !== null);
		return null;
	};
}

/**
 * Array.prototype.find() polyfill
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!Array.prototype.find) {
	Array.prototype.find = function (callback) {
		// 1. Let O be ? ToObject(this value).
		if (this == null) {
			throw new TypeError('"this" is null or not defined');
		}

		var o = Object(this);

		// 2. Let len be ? ToLength(? Get(O, "length")).
		var len = o.length >>> 0;

		// 3. If IsCallable(callback) is false, throw a TypeError exception.
		if (typeof callback !== 'function') {
			throw new TypeError('callback must be a function');
		}

		// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
		var thisArg = arguments[1];

		// 5. Let k be 0.
		var k = 0;

		// 6. Repeat, while k < len
		while (k < len) {
			// a. Let Pk be ! ToString(k).
			// b. Let kValue be ? Get(O, Pk).
			// c. Let testResult be ToBoolean(? Call(callback, T, « kValue, k, O »)).
			// d. If testResult is true, return kValue.
			var kValue = o[k];
			if (callback.call(thisArg, kValue, k, o)) {
				return kValue;
			}
			// e. Increase k by 1.
			k++;
		}

		// 7. Return undefined.
		return undefined;
	};
}
/**
 * Array.prototype.findIndex() polyfill
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
 */
if (!Array.prototype.findIndex) {
	Object.defineProperty(Array.prototype, 'findIndex', {
		value: function(predicate) {
		// 1. Let O be ? ToObject(this value).
		if (this == null) {
			throw new TypeError('"this" is null or not defined');
		}

		var o = Object(this);

		// 2. Let len be ? ToLength(? Get(O, "length")).
		var len = o.length >>> 0;

		// 3. If IsCallable(predicate) is false, throw a TypeError exception.
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}

		// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
		var thisArg = arguments[1];

		// 5. Let k be 0.
		var k = 0;

		// 6. Repeat, while k < len
		while (k < len) {
			// a. Let Pk be ! ToString(k).
			// b. Let kValue be ? Get(O, Pk).
			// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
			// d. If testResult is true, return k.
			var kValue = o[k];
			if (predicate.call(thisArg, kValue, k, o)) {
				return k;
			}
			// e. Increase k by 1.
			k++;
		}

		// 7. Return -1.
		return -1;
		},
		configurable: true,
		writable: true
	});
}

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	url = url || window.location.href;
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i=0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

;(function (window, document, undefined) {
	'use strict';

	/**
	 * Create a unique ID for every todo item
	 * @returns {String} uuid todo item ID
	 */
	var uuid = function () {
		var i, random;
		var uuid = '';

		for (i = 0; i < 32; i++) {
			random = Math.random() * 16 | 0;
			if (i === 8 || i === 12 || i === 16 || i === 20) {
				uuid += '-';
			}
			uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
		}

		return uuid;
	};

	/**
	 * Load todos list from localStorage
	 */
	var loadTodos = function () {
		var todos = localStorage.getItem('todos');
		return (todos && JSON.parse(todos)) || [];
	};

	/**
	 * Save todos list to localStorage
	 * @param {Object} todos Todos list object
	 */
	var saveTodos = function (todos) {
		todoList.setData({
			todos: todos,
		});
		localStorage.setItem('todos', JSON.stringify(todos));
	};

	var findTodoIndex = function (id) {
		var todos = todoList.getData().todos;

		return todos.findIndex(function (todo) {
			return todo.id === id;
		});
	};

	var findTodo = function (id) {
		var todos = loadTodos();

		return todos.find(function (todo) {
			return todo.id === id;
		});
	};

	var createTodo = function(e) {
		var newTodoEl = e.target.elements.add;
		if (!newTodoEl) return;

		var value = newTodoEl.value.trim();
		if (!value) return;

		var todos = todoList.getData().todos;
		todos.push({
			id: uuid(),
			title: value,
			completed: false,
		});

		saveTodos(todos);
		newTodoEl.value = '';
	};

	var editTodo = function (e) {
		var editTodoEl = e.target.elements.edit;
		if (!editTodoEl) return;

		var value = editTodoEl.value.trim();
		var todos = todoList.getData().todos;
		var i = findTodoIndex(editApp.getData().todo.id);

		if (value) {
			todos[i].title = value;
		} else {
			todos.splice(i, 1);
		}

		localStorage.setItem('todos', JSON.stringify(todos));
		location.assign('/');
	};

	var toggleTodo = function (e) {
		var id = e.target.closest('.todo-item').id;
		var i = findTodoIndex(id);
		var todos = todoList.getData().todos;

		todos[i].completed = !todos[i].completed;
		saveTodos(todos);
	};

	var deleteTodo = function (e) {
		var id = e.target.closest('.todo-item').id;
		var i = findTodoIndex(id);
		var todos = todoList.getData().todos;

		todos.splice(i, 1);
		saveTodos(todos);
	};

	var homepageApp = new Reef('#app', {
		template: function (props) {
			var content = '';
			content +=
				'<div class="todo-actions">' +
					'<div class="container">' +
						'<form id="add-todo">' +
							'<input type="text" name="add" placeholder="Type a new todo">' +
							'<button type="submit" class="button">Add</button>' +
						'</form>' +
					'</div>' +
				'</div>' +
				'<div class="container">' +
					'<ul id="todo-list" class="todo-list"></ul>' +
				'</div>';

			return content;
		},
	});

	var editApp = new Reef('#app', {
		data: {
			todo: findTodo(getParams().id),
		},
		template: function (props) {
			if (!props.todo) return;

			var content = '';
			content +=
				'<div class="todo-actions">' +
					'<div class="container">' +
						'<form id="edit-todo">' +
							'<input type="text" id="new-todo" name="edit" value="' + props.todo.title + '">' +
							'<button type="submit" class="button">Save</button>' +
						'</form>' +
					'</div>' +
				'</div>';

			return content;
		},
	});

	var todoList = new Reef('#todo-list', {
		data: {
			todos: loadTodos(),
		},
		template: function (props) {
			var content = '';

			if (props.todos.length < 1) {
				return '<li class="todo-none">Your todo list is empty. Hurray! 🥂</li>';
			}

			props.todos.forEach(function (todo) {
				var todoClasses = todo.completed ? 'todo-item completed' : 'todo-item';
				var checked = todo.completed ? 'checked="true"' : '';
				content +=
					'<li id="' + todo.id + '" class="' + todoClasses + '">' +
						'<label class="todo-text"><input type="checkbox" class="toggle-todo" ' + checked + '>' + todo.title + '</label>' +
						'<div class="button-group">' +
							'<a class="button button-text button-edit" href="/edit/?id=' + todo.id + '">Edit</a>' +
							'<button id="delete-todo" class="button button-text button-delete">Delete</button>' +
						'<div>' +
					'</li>';
			});

			return content;
		},
	});

	/**
	 * Event Handlers
	 */
	document.addEventListener('submit', function (e) {
		if (e.target.id === 'add-todo') {
			e.preventDefault();
			createTodo(e);
		}

		if (e.target.id === 'edit-todo') {
			e.preventDefault();
			editTodo(e);
		}
	}, false);

	document.addEventListener('change', function (e) {
		if (e.target.classList.contains('toggle-todo')) {
			toggleTodo(e);
		}
	}, false);

	document.addEventListener('click', function (e) {
		if (e.target.id === 'delete-todo') {
			deleteTodo(e);
			return;
		}
	}, false);

	// Render app
	var app = document.querySelector('[data-app]');

	// Determine the view/UI
	var page = app.getAttribute('data-app');

	// Render the correct UI
	if (page === 'homepage') {
		homepageApp.render();
		todoList.render();
	}

	if (page === 'edit') {
		editApp.render();
	}

})(window, document);
