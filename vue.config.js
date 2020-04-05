module.exports = {
    pages: {
        debug: {
            // entry for the page
            entry: 'src/api-debug.js',
            title: "Post Woman - 接口调试",
            template: 'public/index.html',
            // output as dist/index.html
            filename: 'api-debug.html',
        },
        json: {
            entry: 'src/json-tool.js',
            // title: "main page",
            template: 'public/index.html',
            filename: 'json-tool.html'
        }
    }
};