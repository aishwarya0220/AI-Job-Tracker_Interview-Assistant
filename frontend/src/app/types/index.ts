export interface Job{
    _id: string,
    company: string,
    position: string,
    jobDescription: string,
    status: 'Applied' | 'Interviewing' | 'Offered' | 'Rejected'
    createdAt?: string
}

export interface interviewQuestion {
    question: string,
    userAnswer?: string
}