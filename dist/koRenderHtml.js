(function() {
  var filterDom;

  if (!window.ko) {
    throw new Error('koRenderHtml requires knockout.js');
  }

  filterDom = function(root, filter) {
    var current, next;
    if (filter == null) {
      filter = (function() {
        return true;
      });
    }
    current = root != null ? root.firstChild : void 0;
    while (current) {
      next = current != null ? current.nextSibling : void 0;
      if (filter(current)) {
        filterDom(current, filter);
      } else {
        root.removeChild(current);
      }
      current = next;
    }
    return root;
  };

  window.koRenderHtml = function(template, model, filter) {
    var container;
    if (filter == null) {
      filter = (function() {
        return true;
      });
    }
    container = document.createElement('div');
    container.innerHTML = template;
    ko.applyBindings(model, container);
    filterDom(container, function(node) {
      var _ref;
      return (node != null ? (_ref = node.style) != null ? _ref.display : void 0 : void 0) !== 'none' && filter(node);
    });
    return container.innerHTML;
  };

}).call(this);
