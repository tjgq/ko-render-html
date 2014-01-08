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
    it('should render template with virtual matching if binding', function() {
      var html, model, templ;
      templ = '<div><!-- ko if: cond -->42<!-- /ko --></div>';
      model = ko.mapping.fromJS({
        cond: false
      });
      html = '<div><!-- ko if: cond --><!-- /ko --></div>';
      return expect(koRenderHtml(templ, model)).to.equal(html);
    });
    it('should render template with no bindings and filter function', function() {
      var filter, html, model, templ;
      templ = '<div><span id="spam"></span><span id="eggs"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo'
      });
      filter = function(node) {
        return node.id !== 'spam';
      };
      html = '<div><span id="eggs"></span></div>';
      return expect(koRenderHtml(templ, model, filter)).to.equal(html);
    });
    it('should render template with text binding and filter function', function() {
      var filter, html, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="text: foo"></span></div>';
      model = ko.mapping.fromJS({
        foo: 'foo'
      });
      filter = function(node) {
        return node.id !== 'spam';
      };
      html = '<div>\n<span id="eggs" data-bind="text: foo">foo</span></div>';
      return expect(koRenderHtml(templ, model, filter)).to.equal(html);
    });
    it('should render template with matching visible binding and filter function', function() {
      var filter, html, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="visible: cond"></span></div>';
      model = ko.mapping.fromJS({
        cond: true
      });
      filter = function(node) {
        return node.id !== 'spam';
      };
      html = '<div>\n<span id="eggs" data-bind="visible: cond"></span></div>';
      return expect(koRenderHtml(templ, model, filter)).to.equal(html);
    });
    it('should render template with non-matching visible binding and filter function', function() {
      var filter, html, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="visible: cond"></span></div>';
      model = ko.mapping.fromJS({
        cond: false
      });
      filter = function(node) {
        return node.id !== 'spam';
      };
      html = '<div>\n</div>';
      return expect(koRenderHtml(templ, model, filter)).to.equal(html);
    });
    return it('should render template with non-matching visible binding followed by matching visible binding and filter function', function() {
      var filter, html, model, templ;
      templ = '<div><span id="spam"></span>\n<span id="eggs" data-bind="visible: condFirst"></span>\n<span id="bacon" data-bind="visible: condSecond"></span></div>';
      model = ko.mapping.fromJS({
        condFirst: false,
        condSecond: true
      });
      filter = function(node) {
        return node.id !== 'spam';
      };
      html = '<div>\n\n<span id="bacon" data-bind="visible: condSecond"></span></div>';
      return expect(koRenderHtml(templ, model, filter)).to.equal(html);
    });
  });

}).call(this);
