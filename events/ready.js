module.exports = {
    name: 'ready',
    once: true,
    do(c) {
        console.log(`ready:以${c.user.tag}身分登入`);
    }
};