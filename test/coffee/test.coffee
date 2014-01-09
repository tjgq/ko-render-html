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

    it 'should render template with virtual non-matching if binding', ->
        templ = '''<div><!-- ko if: cond -->42<!-- /ko --></div>'''
        model = ko.mapping.fromJS
            cond: false
        html = '''<div><!-- ko if: cond --><!-- /ko --></div>'''
        expect( koRenderHtml(templ, model) ).to.equal(html)

    it 'should render template with identity map function', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="text: foo"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
        map = (node) ->
            node
        html = '''<div><span id="spam"></span>
                       <span id="eggs" data-bind="text: foo">foo</span></div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with null map function', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="text: foo"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
        map = (node) ->
            null
        html = ''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with a map function that omits a node', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="text: foo"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
        map = (node) ->
            if node.id isnt 'spam' then node
        html = '''<div>
                       <span id="eggs" data-bind="text: foo">foo</span></div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with a map function that replaces a node', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="text: foo"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
        map = (node) ->
            if node.id isnt 'spam' then return node
            div = document.createElement('div')
            div.setAttribute('id', 'bacon')
            return div
        html = '''<div><div id="bacon"></div>
                       <span id="eggs" data-bind="text: foo">foo</span></div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with a map function that sets an attribute', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="text: foo"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
        map = (node) ->
            if node.id is 'spam'
                node.setAttribute('id', 'bacon')
            return node
        html = '''<div><span id="bacon"></span>
                       <span id="eggs" data-bind="text: foo">foo</span></div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with a map function that removes the data-bind attribute', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="text: foo"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
        map = (node) ->
            if node.nodeType is 1
                node.removeAttribute('data-bind')
            return node
        html = '''<div><span id="spam"></span>
                       <span id="eggs">foo</span></div>'''
        expect( koRenderHtml(templ, model, map) ).to.equal(html)

    it 'should render template with a map function that replaces a node with a tree', ->
        templ = '''<div><span id="spam"></span>
                        <span id="eggs" data-bind="text: foo"></span></div>'''
        model = ko.mapping.fromJS
            foo: 'foo'
        map = (node) ->
            if node.id isnt 'spam' then return node
            parent = document.createElement('div')
            parent.setAttribute('id', 'bacon')
            firstChild = document.createElement('p')
            firstChild.setAttribute('id', 'lobster')
            secondChild = document.createElement('p')
            secondChild.setAttribute('id', 'thermidor')
            parent.appendChild(firstChild)
            parent.appendChild(secondChild)
            return parent
        html = '''<div><div id="bacon"><p id="lobster"></p><p id="thermidor"></p></div>
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
