import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: true
    },
    recurrent: {
        type: Boolean,
        required: true
    },
    recurrentType: {
        type: String,
        required: false
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: false,
        expires: '3m'
    }
})

const Event = mongoose.model('Event', EventSchema)
export default Event