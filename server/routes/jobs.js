const express = require('express')

const authenticationToken = require('../middleware/auth')

const router = express.Router()

const Job = require('../models/job')

const jobs = router.post('/', authenticationToken, async (req, res) => {
    try{
        const {company, position, status, jobDescription, notes} = req.body

        const job = await Job.create({
            company,
            position,
            status,
            jobDescription,
            notes,
            user: req.user.id
        })

        res.status(201).json({
            message: "Job entered successfully",
            job
        })
    } catch(err){
        res.status(500).json({error: err.message})
    }
})

const fetchJob = router.get('/', authenticationToken, async (req, res) => {
    try{
        const job = await Job.find({ user: req.user.id })
        res.status(200).json(job)
    } catch(err){
        res.status(500).json({error: err.message})
    }
})

const updateJob = router.put('/:id', authenticationToken, async (req, res) => {
    try{
        const job = await Job.findById(req.params.id)

        if(job.user.toString() == req.user.id)

        if(!job){
            return res.status(404).json('error: Job not found')
        }

    } catch(err){
        res.status(500).json({error: err.message})
    }
})

module.exports = jobs