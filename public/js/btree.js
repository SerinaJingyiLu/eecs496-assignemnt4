// constructor
var BTree = function(order) {
  var tree = Object.create(BTree.prototype);
  tree.root = null;
  tree.order = order;
  tree.current_leaf_offset = 0;
  tree.unattached_nodes = [[]]; // array for unattached nodes based on leaf_offset
  tree.removedKeys = [];
  if (tree.order < 3) {
    Newalert("Degree must be larger than 3!");
    return false;
  }

  return tree;
};

// create a node that belongs to this tree
BTree.prototype.createNode = function(keys, children, parent) {
  return BTreeNode(this, keys, children, parent, this.order);
};

// Search function that returns the leaf node to insert into
BTree.prototype.search = function(value, strict) {
  if (!this.root) return false;
  else return this.root.traverse(value, strict);
};

// Find the whole searchpath
BTree.prototype.searchWholePath = function(value, strict) {
  var wholepath = [];
  if (!this.root) return [];
  else {
    var node = this.root.traverse2(value, strict, wholepath);
    return {node: node, path: wholepath};
  }
};

/*
BTree.prototype.delete = function(value){
  this.removedKeys = [];
  if (!this.search(value, true)) {
    Newalert("The value " + value + " does not exist!");
    return false;
  }
  var target = this.search(value);
  var lowBound = Math.floor(this.order/2)
  target.swapchildren(value, lowBound);
  if(target.keys.length - 1 < lowBound){
    if(target.isLeaf()){
      this.removedKeys.push(value); 
      target.delete(value);
      target.unsetParent();
      
    }

  }else{
    if(target.isLeaf()){
    target.delete(value);
    }
  }



}*/

BTree.prototype.delete = function(value){
  //console.log(this.root);
  this.root.remove(value);
  while (this.root.keyCount() == 0) {
    this.root = this.root.children[0];
  }
  this.root.tidyup();
}

BTree.prototype.removedChild = function(){
  return this.removedKeys;
}

// Main insertion function
BTree.prototype.insert = function(value, silent) {
  if (this.search(value, true)) {
    if (!silent) Newalert("The value " + value + " already exists!");
    return false;
  }

  this.current_leaf_offset = 0;
  this.unattached_nodes = [[]];

  // 1. Find which leaf the inserted value should go
  var target = this.search(value);
  if (!target) {
    // create new root node
    this.root = this.createNode();
    target = this.root;
  }

  // 2. Apply target.insert (recursive)
  target.insert(value);
};



BTree.prototype.addUnattached = function(node, level) {
  this.unattached_nodes[level] = this.unattached_nodes[level] || [];

  // add node to unattached at specific level
  this.unattached_nodes[level].push(node);

  // sort all unattached nodes at this level, ascending
  this.unattached_nodes[level].sort(function(a, b) {
    first = parseInt(a.keys[0]);
    second = parseInt(b.keys[0]);
    if (first > second) return 1;
    else if (first < second) return -1;
    else return 0;
  });
};
BTree.prototype.removeUnattached = function(node, level) {
  index = this.unattached_nodes[level].indexOf(node);
  if (index > -1) {
    this.unattached_nodes[level].splice(index, 1);
  }
};

BTree.prototype.insertWholePath = function(value, silent) {
  if (this.search(value, true)) {
    if (!silent) Newalert("The value " + value + " already exists!");
    return false;
  }
  var wholePath = [];
  this.current_leaf_offset = 0;
  this.unattached_nodes = [[]];

  // 1. Find which leaf the inserted value should go
  var target = this.search(value);
  var searchPath = this.searchWholePath(value);
  wholePath.push({"type":"search", "value":searchPath});
  if (!target) {
    // create new root node
    this.root = this.createNode();
    target = this.root;
    wholePath.push({"type":"newnode", target});
  }

  // 2. Apply target.insert (recursive)
  target.insert(value);
  return wholePath;
};

// Generate tree json for d3.js to consume
BTree.prototype.toJSON = function() {
  root = this.root;
  return root.toJSON();
};

// seed bTree with "count" unique numbers
BTree.prototype.seed = function(count) {
  var list = [];

  upper = 100;
  if (count > 50) upper = count * 2;

  for (var i = 1; i < upper; i++) list.push(i);

  for (var i = 0; i < count; i++) {
    list.sort(function(a, b) {
      return Math.floor(Math.random() * 3) - 1;
    });
    current = list.shift();
    this.insert(current, true);
  }
};

BTree.prototype.isEmpty = function() {
  return !this.root;
};

function Newalert(e) {
  $("body").append(
    '<div id="msg"><div id="msg_top">Warning<span class="msg_close">×</span></div><div id="msg_cont">' +
      e +
      '</div><div class="msg_close" id="msg_clear">OK</div></div>'
  );
  $(".msg_close").click(function() {
    $("#msg").remove();
  });
}