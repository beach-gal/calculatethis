import express, { Request, Response } from 'express'
import { runYourAI } from './lib/runYourAI' // adjust path if needed

const app = express()

app.use(express.json())

app.post('/api/run', async (req: Request, res: Response) => {
  const result = await runYourAI(req.body)
  res.json(result)
})

export default app