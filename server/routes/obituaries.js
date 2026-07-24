import { Router } from 'express'
import { slugify, withId } from '../lib/slugify.js'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const MAX_CONTENT_LENGTH = 3000 // ~500 words

export default function createObituariesRouter(db) {
  const router = Router()

  const listStmt = db.prepare(
    'SELECT * FROM obituaries ORDER BY submitted_at DESC LIMIT ? OFFSET ?'
  )
  const countStmt = db.prepare('SELECT COUNT(*) AS total FROM obituaries')
  const insertStmt = db.prepare(`
    INSERT INTO obituaries (name, born_at, died_at, content, author, slug)
    VALUES (@name, @born_at, @died_at, @content, @author, @slug)
  `)
  const updateSlugStmt = db.prepare('UPDATE obituaries SET slug = ? WHERE id = ?')

  // Insert + slug-fix-up happen atomically, since the slug depends on an id
  // that only exists after the insert.
  const createObituary = db.transaction((data) => {
    const info = insertStmt.run({ ...data, slug: 'pending' })
    const slug = withId(slugify(data.name), info.lastInsertRowid)
    updateSlugStmt.run(slug, info.lastInsertRowid)
    return { id: info.lastInsertRowid, slug }
  })

  // GET /api/obituaries?page=1&perPage=3
  router.get('/', (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const perPage = Math.max(1, parseInt(req.query.perPage, 10) || 3)
    const offset = (page - 1) * perPage

    const entries = listStmt.all(perPage, offset)
    const { total } = countStmt.get()

    res.json({ entries, page, perPage, totalPages: Math.ceil(total / perPage) })
  })

  // POST /api/obituaries
  router.post('/', (req, res) => {
    const { name, born_at, died_at, content, author } = req.body ?? {}
    const errors = {}

    if (!name?.trim()) errors.name = 'Please input the Name of the Deceased.'
    if (!DATE_RE.test(born_at ?? '')) errors.born_at = 'Please input a valid Date in the format YYYY-MM-DD.'
    if (!DATE_RE.test(died_at ?? '')) errors.died_at = 'Please input a valid Date in the format YYYY-MM-DD.'
    if (!content?.trim()) errors.content = 'Please enter the obituary content.'
    else if (content.length > MAX_CONTENT_LENGTH) errors.content = `Content must be under ${MAX_CONTENT_LENGTH} characters.`
    if (!author?.trim()) errors.author = "Please input the Author's name here, it is required."

    if (Object.keys(errors).length > 0) return res.status(400).json({ errors })

    const result = createObituary({
      name: name.trim(),
      born_at,
      died_at,
      content: content.trim(),
      author: author.trim()
    })

    res.status(201).json(result)
  })

  return router
}
