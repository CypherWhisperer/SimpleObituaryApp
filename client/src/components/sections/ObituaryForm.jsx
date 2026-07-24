import { useState } from 'react'

const DATE_HELP = 'Please input a valid Date in the format YYYY-MM-DD.'
const MAX_CONTENT_LENGTH = 3000 // keep in sync with the backend's MAX_CONTENT_LENGTH

const initialForm = { name: '', born_at: '', died_at: '', content: '', author: '' }

function validateClientSide(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please input the Name of the Deceased, it is required.'
  if (!form.born_at) errors.born_at = DATE_HELP
  if (!form.died_at) errors.died_at = DATE_HELP
  if (!form.content.trim()) errors.content = 'Please enter the obituary content, it is required.'
  else if (form.content.length > MAX_CONTENT_LENGTH) errors.content = `Content must be under ${MAX_CONTENT_LENGTH} characters.`
  if (!form.author.trim()) errors.author = "Please input the Author's name here, it is required."
  return errors
}

export function ObituaryForm({ onSubmit, onSuccess }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleChange(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      // Clear that field's error the instant the user edits it, rather than
      // making them resubmit just to find out it's already fixed.
      setErrors((errs) => (errs[field] ? { ...errs, [field]: undefined } : errs))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const clientErrors = validateClientSide(form)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setSubmitting(true)
    const result = await onSubmit(form) // this is submitObituary from useObituaries
    setSubmitting(false)

    if (!result.ok) {
      setErrors(result.errors) // authoritative errors from the backend (e.g. would-be duplicate handling)
      return
    }

    setForm(initialForm)
    onSuccess?.()
  }

  const fieldClass = (field) => [
    'w-full rounded-md border bg-surface px-3 py-2 font-inter text-sm text-foreground',
    'placeholder:text-muted-foreground focus:outline-none',
    errors[field] ? 'border-border-error' : 'border-border focus:border-border-focus'
  ].join(' ')

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md mx-auto space-y-5">
      <Field id="name" label="Deceased Name" error={errors.name} className={fieldClass('name')}>
        <input id="name" type="text" placeholder="John Doe" value={form.name}
          onChange={handleChange('name')} className={fieldClass('name')}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
      </Field>

      {/* type="date" over a plain text input: the browser enforces the
          YYYY-MM-DD shape and gives a native picker for free, instead of
          us hand-parsing whatever text format a user might type. */}
      <Field id="born_at" label="Date Of Birth" error={errors.born_at}>
        <input id="born_at" type="date" value={form.born_at}
          onChange={handleChange('born_at')} className={fieldClass('born_at')}
          aria-invalid={!!errors.born_at} aria-describedby={errors.born_at ? 'born_at-error' : undefined} />
      </Field>

      <Field id="died_at" label="Date Of Death" error={errors.died_at}>
        <input id="died_at" type="date" value={form.died_at}
          onChange={handleChange('died_at')} className={fieldClass('died_at')}
          aria-invalid={!!errors.died_at} aria-describedby={errors.died_at ? 'died_at-error' : undefined} />
      </Field>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="content" className="block font-space-grotesk text-sm font-semibold text-foreground mb-1">
            Obituary Body
          </label>
          <span className="text-xs text-muted-foreground">{form.content.length}/{MAX_CONTENT_LENGTH}</span>
        </div>
        <textarea id="content" rows={6} placeholder="Obituary body content here." value={form.content}
          onChange={handleChange('content')} className={fieldClass('content')}
          aria-invalid={!!errors.content} aria-describedby={errors.content ? 'content-error' : undefined} />
        {errors.content && <p id="content-error" className="mt-1 text-xs text-border-error">{errors.content}</p>}
      </div>

      <Field id="author" label="Author Name" error={errors.author}>
        <input id="author" type="text" placeholder="Jane Doe" value={form.author}
          onChange={handleChange('author')} className={fieldClass('author')}
          aria-invalid={!!errors.author} aria-describedby={errors.author ? 'author-error' : undefined} />
      </Field>

      {errors._global && <p className="text-sm text-border-error">{errors._global}</p>}

      <button type="submit" disabled={submitting}
        className="w-full rounded-md bg-cta py-2 font-space-grotesk font-semibold text-cta-foreground disabled:opacity-60">
        {submitting ? 'Processing ...' : 'SUBMIT'}
      </button>
    </form>
  )
}

// Small internal helper so the label+error markup isn't repeated five times —
// not exported, since nothing outside this file needs a bare labeled field.
function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block font-space-grotesk text-sm font-semibold text-foreground mb-1">
        {label}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-border-error">{error}</p>}
    </div>
  )
}
