module.exports = function resolveImport(path) {
    let mod;
    return new Proxy(() => {
        // No op
    }, {
        apply(_target, _this, args) {
            if (!mod && !(mod = require(path))) {
                delete require.cache[require.resolve(path)];
                mod = require(path);
            }
            return mod(...args);
        },
    });
};