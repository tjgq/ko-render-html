(function() {
  describe('koRenderHtml', function() {
    it('should render template with no bindings and empty view model', function() {
      var model, templ;
      templ = '<div>Hello world!</div>';
      model = ko.mapping.fromJS({});
      return expect(koRenderHtml(templ, model)).to.equal(templ);
    });
    it('should render template with no bindings and non-empty view model', function() {
      var model, templ;
      templ = '<div>Hello world!</div>';
      model = ko.mapping.fromJS({
        foo: true,
        bar: false
      });
      return expect(koRenderHtml(templ, model)).to.equal(templ);
    });
    it('should render template with text binding', function() {
      var html, model, templ;
      templ = '<div><span data-bind="text: foo"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo',
        bar: 'bar'
      });
      html = '<div><span data-bind="text: foo">foo</span></div>';
      return expect(koRenderHtml(templ, model)).to.equal(html);
    });
    it('should render template with matching if binding', function() {
      var model, templ;
      templ = '<div><span data-bind="if: cond">42</span></div>';
      model = ko.mapping.fromJS({
        cond: true
      });
      return expect(koRenderHtml(templ, model)).to.equal(templ);
    });
    it('should render template with non-matching if binding', function() {
      var html, model, templ;
      templ = '<div><span data-bind="if: cond">42</span></div>';
      model = ko.mapping.fromJS({
        cond: false
      });
      html = '<div><span data-bind="if: cond"></span></div>';
      return expect(koRenderHtml(templ, model)).to.equal(html);
    });
    it('should render template with matching visible binding', function() {
      var model, templ;
      templ = '<div><span data-bind="visible: show"></span></div>';
      model = ko.mapping.fromJS({
        show: true
      });
      return expect(koRenderHtml(templ, model)).to.equal(templ);
    });
    it('should render template with non-matching visible binding', function() {
      var html, model, templ;
      templ = '<div><span data-bind="visible: show"></span></div>';
      model = ko.mapping.fromJS({
        show: false
      });
      html = '<div></div>';
      return expect(koRenderHtml(templ, model)).to.equal(html);
    });
    it('should render template with non-matching visible binding followed by matching visible binding', function() {
      var html, model, templ;
      templ = '<div><span data-bind="visible: showFirst"></span>\n<span data-bind="visible: showSecond"></span></div>';
      model = ko.mapping.fromJS({
        showFirst: false,
        showSecond: true
      });
      html = '<div>\n<span data-bind="visible: showSecond"></span></div>';
      return expect(koRenderHtml(templ, model)).to.equal(html);
    });
    it('should render template with virtual matching if binding', function() {
      var html, model, templ;
      templ = '<div><!-- ko if: cond -->42<!-- /ko --></div>';
      model = ko.mapping.fromJS({
        cond: true
      });
      html = '<div><!-- ko if: cond -->42<!-- /ko --></div>';
      return expect(koRenderHtml(templ, model)).to.equal(html);
    });
    it('should render template with virtual non-matching if binding', function() {
      var html, model, templ;
      templ = '<div><!-- ko if: cond -->42<!-- /ko --></div>';
      model = ko.mapping.fromJS({
        cond: false
      });
      html = '<div><!-- ko if: cond --><!-- /ko --></div>';
      return expect(koRenderHtml(templ, model)).to.equal(html);
    });
    it('should render template with identity map function', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="text: foo"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo'
      });
      map = function(node) {
        return node;
      };
      html = '<div><span id="spam"></span>\n<span id="eggs" data-bind="text: foo">foo</span></div>';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
    it('should render template with null map function', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="text: foo"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo'
      });
      map = function(node) {
        return null;
      };
      html = '';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
    it('should render template with a map function that omits a node', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="text: foo"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo'
      });
      map = function(node) {
        if (node.id !== 'spam') {
          return node;
        }
      };
      html = '<div>\n<span id="eggs" data-bind="text: foo">foo</span></div>';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
    it('should render template with a map function that replaces a node', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="text: foo"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo'
      });
      map = function(node) {
        var div;
        if (node.id !== 'spam') {
          return node;
        }
        div = document.createElement('div');
        div.setAttribute('id', 'bacon');
        return div;
      };
      html = '<div><div id="bacon"></div>\n<span id="eggs" data-bind="text: foo">foo</span></div>';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
    it('should render template with a map function that sets an attribute', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="text: foo"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo'
      });
      map = function(node) {
        if (node.id === 'spam') {
          node.setAttribute('id', 'bacon');
        }
        return node;
      };
      html = '<div><span id="bacon"></span>\n<span id="eggs" data-bind="text: foo">foo</span></div>';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
    it('should render template with a map function that removes the data-bind attribute', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="text: foo"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo'
      });
      map = function(node) {
        if (node.nodeType === 1) {
          node.removeAttribute('data-bind');
        }
        return node;
      };
      html = '<div><span id="spam"></span>\n<span id="eggs">foo</span></div>';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
    it('should render template with a map function that replaces a node with a tree', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="text: foo"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo'
      });
      map = function(node) {
        var firstChild, parent, secondChild;
        if (node.id !== 'spam') {
          return node;
        }
        parent = document.createElement('div');
        parent.setAttribute('id', 'bacon');
        firstChild = document.createElement('p');
        firstChild.setAttribute('id', 'lobster');
        secondChild = document.createElement('p');
        secondChild.setAttribute('id', 'thermidor');
        parent.appendChild(firstChild);
        parent.appendChild(secondChild);
        return parent;
      };
      html = '<div><div id="bacon"><p id="lobster"></p><p id="thermidor"></p></div>\n<span id="eggs" data-bind="text: foo">foo</span></div>';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
    it('should render template with matching visible binding and map function', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="visible: cond"></span></div>';
      model = ko.mapping.fromJS({
        cond: true
      });
      map = function(node) {
        if (node.id !== 'spam') {
          return node;
        }
      };
      html = '<div>\n<span id="eggs" data-bind="visible: cond"></span></div>';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
    it('should render template with non-matching visible binding and map function', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="visible: cond"></span></div>';
      model = ko.mapping.fromJS({
        cond: false
      });
      map = function(node) {
        if (node.id !== 'spam') {
          return node;
        }
      };
      html = '<div>\n</div>';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
    return it('should render template with non-matching visible binding followed by matching visible binding and map function', function() {
      var html, map, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="visible: condFirst"></span>\n<span id="bacon" data-bind="visible: condSecond"></span></div>';
      model = ko.mapping.fromJS({
        condFirst: false,
        condSecond: true
      });
      map = function(node) {
        if (node.id !== 'spam') {
          return node;
        }
      };
      html = '<div>\n\n<span id="bacon" data-bind="visible: condSecond"></span></div>';
      return expect(koRenderHtml(templ, model, map)).to.equal(html);
    });
  });

}).call(this);
