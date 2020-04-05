
function addListener(selector, type, fn) {
    var el = document.querySelector(selector);
    if (!el) return;

    el.addEventListener(type, fn);
};

function openApiDebug() {
    window.open(chrome.extension.getURL('api-debug.html'));
}

function openJSONTool() {
    window.open(chrome.extension.getURL('api-debug.html'));
}

addListener('#api-debug', 'click', openApiDebug);
