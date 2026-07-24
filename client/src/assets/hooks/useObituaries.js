import { useState, useEffect, useCallback } from 'react'

const PER_PAGE = 3

export function useObituaryList() {
  const [entries, setEntries] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPage = useCallback(async (targetPage) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/obituaries?page=${targetPage}&perPage=${PER_PAGE}`)
      if (!res.ok) throw new Error('Failed to load obituaries')
      const data = await res.json()
      setEntries(data.entries)
      setTotalPages(data.totalPages)
      setPage(data.page)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPage(1)
  }, [fetchPage])

  return { entries, page, totalPages, loading, error, goToPage: fetchPage }
}

export function useSubmitObituary() {
  const submitObituary = useCallback(async (formData) => {
    try {
      const res = await fetch('/api/obituaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.status === 400) {
        const { errors } = await res.json()
        return { ok: false, errors }
      }
      if (!res.ok) throw new Error('Failed to submit obituary')

      return { ok: true }
    } catch (err) {
      return { ok: false, errors: { _global: err.message } }
    }
  }, [])

  return { submitObituary }
}
