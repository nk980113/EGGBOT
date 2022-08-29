module.exports = async function preloadDB() {
    await require('../DB').authReadyPromise;
    require('../DB/soup');
};