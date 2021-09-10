import express from 'express'
import ensureAuth from '../config/auth.js'
import Event from '../models/Event.js'
const router = express.Router()

router.get('/', (req, res) => {
    res.render('welcome')
})

router.get('/dashboard', ensureAuth, (req, res) => {
    let username = req.user.name
    Event.find({owner: username})
        .then(events => {
            if(!events) console.log('No events found in DB')
            const now = Date.now()
            events.forEach(event => {
                if(event.endTime < now){
                    // console.log('Event' + event.title + ' is over and will be deleted')
                }
            })
            res.render('dashboard', {
                name: req.user.name,
                events: events
            })
        })
        .catch(err => console.log('Error fetching events from DB'))

    
})

export default router