describe 'koRenderHtml', ->

    it 'should render template with no bindings and empty view model', ->
        templ = '''<div>Hello world!</div>'''
        model = ko.mapping.fromJS {}
        expect( koRenderHtml(templ, model) ).to.equal(templ)

    it 'should render template with no bindings and non-empty view model', ->
        templ = '''<div>Hello world!</div>'''
        model = ko.mapping.fromJS
            foo: true
            bar: false
        expect( koRenderHtml(templ, model) ).to.equal(templ)

    it 'should render template with text binding', ->
        templ = '''<div><span data-bind="text: foo"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
            bar: 'bar'
        html = '''<div><span data-bind="text: foo">foo</span></div>'''
        expect( koRenderHtml(templ, model) ).to.equal(html)

    it 'should render template with matching if binding', ->
        templ = '''<div><span data-bind="if: cond">42</span></div>'''
        model = ko.mapping.fromJS
            cond: true
        expect( koRenderHtml(templ, model) ).to.equal(templ)

    it 'should render template with non-matching if binding', ->
        templ = '''<div><span data-bind="if: cond">42</span></div>'''
        model = ko.mapping.fromJS
            cond: false
        html = '''<div><span data-bind="if: cond"></span></div>'''
        expect( koRenderHtml(templ, model) ).to.equal(html)

    it 'should render template with matching visible binding', ->
        templ = '''<div><span data-bind="visible: show"></span></div>'''
        model = ko.mapping.fromJS
            show: true
        expect( koRenderHtml(templ, model) ).to.equal(templ)

    it 'should render template with non-matching visible binding', ->
        templ = '''<div><span data-bind="visible: show"></span></div>'''
        model = ko.mapping.fromJS
            show: false
        html = '''<div></div>'''
        expect( koRenderHtml(templ, model) ).to.equal(html)

    it 'should render template with non-matching visible binding followed by matching visible binding', ->
        templ = '''<div><span data-bind="visible: showFirst"></span>
                        <span data-bind="visible: showSecond"></span></div>'''
        model = ko.mapping.fromJS
            showFirst: false
            showSecond: true
        html = '''<div>
                       <span data-bind="visible: showSecond"></span></div>'''
        expect( koRenderHtml(templ, model) ).to.equal(html)

    it 'should render template with virtual matching if binding', ->
        templ = '''<div><!-- ko if: cond -->42<!-- /ko --></div>'''
        model = ko.mapping.fromJS
            cond: true
        html = '''<div><!-- ko if: cond -->42<!-- /ko --></div>'''
        expect( koRenderHtml(templ, model) ).to.equal(html)

    it 'should render template with virtual matching if binding', ->
        templ = '''<div><!-- ko if: cond -->42<!-- /ko --></div>'''
        model = ko.mapping.fromJS
            cond: false
        html = '''<div><!-- ko if: cond --><!-- /ko --></div>'''
        expect( koRenderHtml(templ, model) ).to.equal(html)

    it 'should render template with no bindings and map function', ->
        templ = '''<div><span id="spam"></span><span id="eggs"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
        map = (node) ->
            if node.id isnt 'spam' then node
        html = '''<div><span id="eggs"></span></div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with text binding and map function', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="text: foo"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
        map = (node) ->
            if node.id isnt 'spam' then node
        html = '''<div>
                       <span id="eggs" data-bind="text: foo">foo</span></div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with matching visible binding and map function', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="visible: cond"></span></div>'''
        model = ko.mapping.fromJS
            cond: true
        map = (node) ->
            if node.id isnt 'spam' then node
        html = '''<div>
                       <span id="eggs" data-bind="visible: cond"></span></div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with non-matching visible binding and map function', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="visible: cond"></span></div>'''
        model = ko.mapping.fromJS
            cond: false
        map = (node) ->
            if node.id isnt 'spam' then node
        html = '''<div>
                       </div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with non-matching visible binding followed by matching visible binding and map function', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="visible: condFirst"></span>
                        <span id="bacon" data-bind="visible: condSecond"></span></div>'''
        model = ko.mapping.fromJS
            condFirst: false
            condSecond: true
        map = (node) ->
            if node.id isnt 'spam' then node
        html = '''<div>

                       <span id="bacon" data-bind="visible: condSecond"></span></div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)
