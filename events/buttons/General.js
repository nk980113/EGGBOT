/**
 * @param {import('discord.js').ButtonInteraction} btn
 */
const generalHandler = async btn => {
    switch (btn.customId) {
        case 'Gdel': {
            try {
                await btn.message.delete();
            } catch {} // eslint-disable-line no-empty
        }
    }
};
module.exports = generalHandler;