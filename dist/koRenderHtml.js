(function() {
  var identity, walkDom;

  if (!window.ko) {
    throw new Error('koRenderHtml requires knockout.js');
  }

  identity = function(x) {
    return x;
  };

  walkDom = function(root, map) {
    var current, newCurrent, next;
    current = root != null ? root.firstChild : void 0;
    while (current) {
      next = current != null ? current.nextSibling : void 0;
      newCurrent = map(current);
      if (newCurrent != null) {
        if (newCurrent !== current) {
          root.replaceChild(newCurrent, current);
        }
        walkDom(newCurrent, map);
      } else {
        root.removeChild(current);
      }
      current = next;
    }
    return root;
  };

  window.koRenderHtml = function(template, model, map) {
    var container;
    if (map == null) {
      map = identity;
    }
    container = document.createElement('div');
    container.innerHTML = template;
    ko.applyBindings(model, container);
    walkDom(container, function(node) {
      var _ref;
      if ((node != null ? (_ref = node.style) != null ? _ref.display : void 0 : void 0) === 'none') {
        return null;
      } else {
        return map(node);
      }
    });
    return container.innerHTML;
  };

}).call(this);
