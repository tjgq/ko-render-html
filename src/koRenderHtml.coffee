unless window.ko then throw new Error 'koRenderHtml requires knockout.js'

# Remove nodes not matching filterFn from the DOM rooted at root.
filterDom = (root, filter = (-> true)) ->
    current = root?.firstChild
    while current
        next = current?.nextSibling
        if filter(current)
            filterDom(current, filter)
        else
            root.removeChild(current)
        current = next
    root

# Render an HTML template with knockout.js bindings
# given a knockout.js view model.
# Optionally filter out any elements not matching filter.
window.koRenderHtml = (template, model, filter = (-> true)) ->
    container = document.createElement('div')
    container.innerHTML = template
    ko.applyBindings(model, container)
    filterDom container, (node) ->
        node?.style?.display isnt 'none' and filter(node)
    container.innerHTML
