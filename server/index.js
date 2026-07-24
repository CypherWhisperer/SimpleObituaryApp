import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'
import createObituariesRouter from './routes/obituaries.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const db = new Database(path.resolve(__dirname, 'db/obituary_app.db'))
db.pragma('journal_mode = WAL') // lets reads and writes happen concurrently against the file

const app = express()
app.use(express.json())
app.use('/api/obituaries', createObituariesRouter(db))

const PORT = 3001
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
