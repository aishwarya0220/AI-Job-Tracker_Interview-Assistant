const express = require('express')

const authenticationToken = require('../middleware/auth')

const router = express.Router()

const Job = require('../models/job')

const { generateInterviewQuestions, evaluateInterviewAnswer } = require('../utils/aiService')

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
        console.log('CREATE JOB ERROR', err)
        res.status(500).json({error: err.message})
    }
})

const fetchJob = router.get('/', authenticationToken, async (req, res) => {
    try{
        const job = await Job.find({ user: req.user.id })
        if(!job){
            return res.status(404).json('Job not found')
        }
        res.status(200).json(job)

    } catch(err){
        res.status(500).json({error: err.message})
    }
})

const updateJob = router.put('/:id', authenticationToken, async (req, res) => {
    try{
        const job = await Job.findById(req.params.id)

        if(!job){
            return res.status(404).json('error: Job not found')
        }

        if(job.user.toString() == req.user.id){
            const update = await Job.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

            res.status(200).json({
                message: "Job updated",
                update})
        }

        if(job.user.toString() !== req.user.id){
            return res.status(403).json('Not authorized to update this job')
        }
        

    } catch(err){
        res.status(500).json({error: err.message})
    }
})

const deleteJob = router.delete('/:id', authenticationToken, async (req, res) => {
    try{
    const job = await Job.findById(req.params.id)

    if(!job){
        return res.status(404).json('Job not found')
    }

    if(job.user.toString() == req.user.id){
    
        const remove = await Job.findByIdAndDelete(req.params.id)

        res.status(200).json({message: 'Job removed successfully'})
    }

    if(job.user.toString() !== req.user.id){
        return res.status(403).json('Not authorized')
    }

    } catch(err){
        res.status(500).json({error: err.message})
    }
})

const interviewPrep = router.post('/:id/interview-prep', authenticationToken, async (req, res) => {
    try{
        const job = await Job.findById(req.params.id)

        if(!job){
            return res.status(404).json('Job not found')
        }

        if(job.user.toString() !== req.user.id){
            return res.status(401).json('Unauthorized')
        }

        if(job.user.toString() == req.user.id){
            const response = await generateInterviewQuestions(
                job.company,
                job.position,
                job.jobDescription  
                )

            job.interviewQuestions = response

            await job.save()

            res.status(200).json({ question: response})
        }

        
    } catch(err){
        res.status(500).json({error: err.message})
    }
})

const getSavedQuestions = router.get('/:id/interview-prep', authenticationToken, async (req, res) => {
    try{
    const job = await Job.findById(req.params.id)

    if(!job){
        return res.status(404).json('Job not found') 
    }
    
    
    const questions = job.interviewQuestions.map(item => ({
        question: item.question
    }))
    
    if(job.user.toString() == req.user.id){
        
        res.status(200).json(questions)
    }


    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

const interviewDuplexComm = router.post('/:id/interview-feedback', authenticationToken, async (req, res) => {
    try{
        const job = await Job.findById(req.params.id)

        if(!job){
            return res.status(404).json('Job not found') 
        }

        const { question, conversationHistory, userAnswer } = req.body

        if(!question || !userAnswer){
            return res.status(400).json({ error: 'Question and userAnswer are required.' })
        }

        const recentHistory = Array.isArray(conversationHistory)
            ? conversationHistory.slice(-3)
            : []

        const feedback = await evaluateInterviewAnswer({
            company: job.company,
            position: job.position,
            question,
            recentHistory,
            userAnswer
        })

        return res.status(200).json({ feedback })    
    } catch (err) {
        console.error('Error getting interview feedback:', err);
        return res.status(500).json({ error: err.message });
    }

})

module.exports = jobs