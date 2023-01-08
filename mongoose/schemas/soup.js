const { soup } = require('../connections');
const { Schema } = require('mongoose');

const questionSchema = new Schema({
    soupId: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    publicAnswer: {
        type: Boolean,
        required: true,
    },
}, {
    methods: {
        getShortContent() {
            return this.content.length >= 20
                ? `${this.content.slice(0, 18)}...`
                : this.content;
        },
    },
    statics: {
        async getNextId() {
            const soupWithMaxId = await this.find().sort({ soupId: -1 }).findOne();
            if (!soupWithMaxId) return 1;
            return soupWithMaxId.soupId + 1;
        },
    },
});

questionSchema.pre('save', async function() {
    this.soupId = await Questions.getNextId();
});

const Questions = soup.model('Question', questionSchema);

module.exports = {
    Questions,
};