unless window.ko then throw new Error 'koRenderHtml requires knockout.js'

identity = (x) -> x

# Walk the DOM rooted at root and transform each node through a map function.
walkDom = (root, map) ->
    current = root?.firstChild
    while current
        next = current?.nextSibling
        newCurrent = map(current)
        if newCurrent?
            if newCurrent isnt current
                root.replaceChild(newCurrent, current)
            walkDom(newCurrent, map)
        else
            root.removeChild(current)
        current = next
    root

# Render an HTML template with knockout.js bindings given a knockout.js
# view model. The map function is called for each node in the resulting
# DOM. The original node is replaced by the returned node, or removed if
# the return value is null.
window.koRenderHtml = (template, model, map = identity) ->
    container = document.createElement('div')
    container.innerHTML = template
    ko.applyBindings(model, container)
    walkDom container, (node) ->
        if node?.style?.display is 'none' then null else map(node)
    container.innerHTML
