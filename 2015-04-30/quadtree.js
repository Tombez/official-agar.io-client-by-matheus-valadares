/*
 * QuadTree Implementation in JavaScript
 * @author: silflow <https://github.com/silflow>
 */

var QUAD = {}; // global var for the quadtree

QUAD.init = function(args) {
	var TOP_LEFT     = 0;
	var TOP_RIGHT    = 1;
	var BOTTOM_LEFT  = 2;
	var BOTTOM_RIGHT = 3;
	var PARENT       = 4;

	// assign default values
	var maxChildren = args.maxChildren || 2;
	var maxDepth = args.maxDepth || 4;

	function Node(x, y, w, h, depth) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.depth = depth;
		this.items = [];
		this.nodes = [];
	}

	Node.prototype = {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		depth: 0,
		items: null,
		nodes: null,

		exists: function(selector){
			for(var i = 0; i < this.items.length; ++i) {
				var item = this.items[i];
				if(item.x >= selector.x && item.y >= selector.y && item.x < selector.x + selector.w && item.y < selector.y + selector.h){
					return true;
				}
			}

			if(this.nodes.length != 0) {
				// call retrieve on all matching subnodes
				var self = this;
				return this.findOverlappingNodes(selector, function(dir) {
					return self.nodes[dir].exists(selector);
				});
			}

			return false;
		},

		/**
		 * iterates all items that match the selector and invokes the supplied callback on them.
		 */
		retrieve: function(item, callback) {
			for(var i = 0; i < this.items.length; ++i) {
				callback(this.items[i]);
			}

			// check if Node has subnodes
			if(this.nodes.length != 0) {
				// call retrieve on all matching subnodes
				var self = this;
				this.findOverlappingNodes(item, function(dir) {
					self.nodes[dir].retrieve(item, callback);
				});
			}
		},

		/**
		 * Adds a new Item to the Node.
		 *
		 * If the Node already has subnodes, the item gets pushed down one level.
		 * If the item does not fit into the subnodes, it gets saved in the
		 * "children"-array.
		 *
		 * If the maxChildren limit is exceeded after inserting the item,
		 * the Node gets divided and all items inside the "children"-array get
		 * pushed down to the new subnodes.
		 */
		insert: function(item) {
			if(this.nodes.length != 0) {
				// get the Node in which the item fits best
				var i = this.findInsertNode(item);
				//if(i === PARENT) {
				//	// if the item does not fit, push it into the
				//	// children array
				//	this.items.push(item);
				//} else {
					this.nodes[i].insert(item);
				//}
			} else {

				//divide the Node if maxChildren is exceeded and maxDepth is not reached
				if (this.items.length >= maxChildren && this.depth < maxDepth) {
					this.divide();

					//this.insert(item);
					// which inlines to
					this.nodes[this.findInsertNode(item)].insert(item);
				}else{
					this.items.push(item);
				}
			}
		},

		/**
		 * Find a Node the item should be inserted in.
		 */
		findInsertNode: function(item) {
			// left
			if(item.x < this.x + (this.w / 2)) {
				if (item.y < this.y + (this.h / 2)) {
					return TOP_LEFT;
				}
				//if (item.y >= this.y + (this.h / 2)) {
					return BOTTOM_LEFT;
				//}
				//return PARENT;
			}

			// right
			//if(item.x >= this.x + (this.w / 2)) {
				if (item.y < this.y + (this.h / 2)) {
					return TOP_RIGHT;
				}
				//if (item.y >= this.y + (this.h / 2)) {
					return BOTTOM_RIGHT;
				//}
				//return PARENT;
			//}

			//return PARENT;
		},

		/**
		 * Finds the regions the item overlaps with. See constants defined
		 * above. The callback is called for every region the item overlaps.
		 */
		findOverlappingNodes: function(item, callback) {
			// left
			if (item.x < this.x + (this.w / 2)) {
				if (item.y < this.y + (this.h / 2)) {
					if(callback(TOP_LEFT)) return true;
				}
				if (item.y >= this.y + this.h / 2) {
					if(callback(BOTTOM_LEFT)) return true;
				}
			}
			// right
			if (item.x >= this.x + (this.w / 2)) {
				if (item.y < this.y + (this.h / 2)) {
					if(callback(TOP_RIGHT)) return true;
				}
				if (item.y >= this.y + this.h / 2) {
					if(callback(BOTTOM_RIGHT)) return true;
				}
			}

			return false;
		},

		/**
		 * Divides the current Node into four subnodes and adds them
		 * to the nodes array of the current Node. Then reinserts all
		 * children.
		 */
		divide: function(){
			var childrenDepth = this.depth + 1;
			// set dimensions of the new nodes
			var width = (this.w / 2);
			var height = (this.h / 2);
			// create top left Node
			this.nodes.push(new Node(this.x, this.y, width, height, childrenDepth));
			// create top right Node
			this.nodes.push(new Node(this.x + width, this.y, width, height, childrenDepth));
			// create bottom left Node
			this.nodes.push(new Node(this.x, this.y + height, width, height, childrenDepth));
			// create bottom right Node
			this.nodes.push(new Node(this.x + width, this.y + height, width, height, childrenDepth));

			var oldChildren = this.items;
			this.items = [];
			for(var i = 0; i < oldChildren.length; i++) {
				this.insert(oldChildren[i]);
			}
		},

		/**
		 * Clears the Node and all its subnodes.
		 */
		clear: function(){
			for(var i = 0; i < this.nodes.length; i++) {
				this.nodes[i].clear();
			}
			this.items.length = 0;
			this.nodes.length = 0;
		}
	};

	return {

		root: (function() {
			return new Node(args.minX, args.minY, args.maxX - args.minX, args.maxY - args.minY, 0);
		}()),

		insert: function(item) {
			this.root.insert(item);
		},

		retrieve: function(selector, callback) {
			this.root.retrieve(selector, callback);
		},

		exists: function(selector){
			return this.root.exists(selector);
		},

		clear: function() {
			this.root.clear();
		}
	};
};
