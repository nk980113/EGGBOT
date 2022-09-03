module.exports = function resolveImport(path) {
    let mod;
    let imported = false;
    return new Proxy(() => {
        // No op
    }, {
        apply(_target, _this, args) {
            if (!imported && !(mod = require(path))) {
                delete require.cache[require.resolve(path)];
                mod = require(path);
                imported = true;
            }
            return mod(...args);
        },
    });
};