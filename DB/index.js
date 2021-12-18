const { readFileSync, writeFileSync } = require('fs');
const copyObj = (obj, proto = null) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    proto = typeof proto === 'object' && proto !== null ? proto : Reflect.getPrototypeOf(obj);
    const copiedObj = Object.create(proto);
    for (const prop in obj) copiedObj[prop] = copyObj(obj[prop], proto);
    return copiedObj;
};
const createProxyBind = (parent, child, propName) => {
    const childCopy = copyObj(child);
    return new Proxy(null, {
        get(_, prop) {
            const target = childCopy[prop];
            if (typeof target === 'object' && target !== null) return createProxyBind(childCopy, target, prop);
            return target;
        },
        set(_, prop, val) {
            try {
                childCopy[prop] = copyObj(val, Object.prototype);
                parent[propName] = childCopy;
            } catch {
                return false;
            }
            return true;
        },
    });
};
const dbWrapper = filePath => {
    const data = JSON.parse(readFileSync(filePath, { encoding: 'utf-8' }));
    return new Proxy(null, {
        get(_, prop) {
            const target = data[prop];
            if (typeof target !== 'object' || target === null) return target;
            return createProxyBind(data, data[prop], prop);
        },
        set(_, prop, val) {
            data[prop] = val;
            writeFileSync(filePath, JSON.stringify(filePath), { encoding: 'utf-8' });
        },
    });
};
module.exports = dbWrapper;
module.exports.copyObj = copyObj;