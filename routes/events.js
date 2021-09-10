import express from 'express'
import ensureAuth from '../config/auth.js'

import Event from '../models/Event.js'
const router = express.Router()

router.get('/add', ensureAuth, (req, res) => {
    Event.countDocuments({owner: req.user.name}, (err, count) => {
        if(err) console.log(err)
        if(count > 9){
            req.flash('error_msg', 'You have reached your limit of 10 meetings!')
            res.redirect('/dashboard')
        } else {
            res.render('add', {
                title: 'Create a new meeting',
                myName: req.user.name
            })
        }
    })
    
})

router.post('/add', (req, res) => {
    let event = new Event();
    event.owner = req.body.myName
    event.title = req.body.title
    event.details = req.body.details
    // console.log('req.body.startDate')
    // console.log(req.body.startDate)
    let startDate = new Date(req.body.startDate)
    // console.log('*&')
    // console.log(startDate)

    // const year = startDate.getFullYear()
    // const month = startDate.getMonth()
    // const day = startDate.getDay()
    // const hours = startDate.getHours()
    // const minutes = startDate.getMinutes()
    // let finalDate = new Date(year, month, day, hours+3, minutes)
    // console.log('start date constructed')
    // console.log(finalDate)
    event.startTime = startDate
    if(req.body.endDate){
        let endDate = new Date(req.body.endDate)
        // console.log('raw end date')
        // console.log(endDate)
        // const year = endDate.getFullYear()
        // const month = endDate.getMonth()
        // const day = endDate.getDay()
        // const hours = endDate.getHours()
        // const minutes = endDate.getMinutes()
        // let finalDate = new Date(year, month, day, hours+3, minutes)
        // console.log('final date constructed')
        // console.log(finalDate)
        event.endTime = endDate
    } 
    if(req.body.recurrent == 'on'){
        event.recurrent = true 
        event.recurrentType = req.body.recurrentType
    } else {
        event.recurrent = false 
    }

    console.log(event)

    event.save()
        .then(event => {
            req.flash('success_msg', 'Meeting added to list')
            res.redirect('/dashboard')
        })
        .catch((err) => {
            if(err) {
                 console.log(err)
            }
          
        })
})

// Load edit form
router.get('/edit/:id', ensureAuth, (req, res) => {
   
    Event.findById(req.params.id, (err, event) => {
        if(err) console.log(err)
        console.log('edit')
        console.log(event)
        res.render('edit', {
            event: {
                _id: event._id,
                owner: event.owner,
                title: event.title,
                details: event.details,
                recurrent: event.recurrent,
                recurrentType: event.recurrentType,
                startTime: event.startTime.toISOString().slice(0,-8),
                endTime: event.endTime ? event.endTime.toISOString().slice(0,-8) : 'N/A'
            },
            title: 'Edit meeting',
            myName: event.owner
        })
    })
})

router.post('/edit/:id', (req, res) => {
    let event = {}
    console.log('post')
    console.log(req.body)
    console.log(req.body.recurrentType)
    event._id = req.params.id
    event.title = req.body.title
    event.owner = req.body.myName
    event.details = req.body.details
    event.startTime = req.body.startDate
    event.endTime = req.body.endDate
    event.recurrent = req.body.recurrent === 'on' ? true : false
    event.recurrentType = req.body.recurrentType

    let query = {_id: req.params.id}

    Event.updateOne(query, event)
        .then(() => {
            req.flash('success_msg', 'Meeting updated successfully')
            res.redirect('/dashboard')
        })
        .catch(err => console.log(err))

})

router.get('/delete/:id', (req, res) => {
    Event.deleteOne({_id: req.params.id}, (err) => {
        if(err) console.log(err)
        req.flash('success_msg', 'Meeting deleted successfully')
        res.redirect('/dashboard')
    })
})

export default router