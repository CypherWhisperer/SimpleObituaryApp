/**
 * Renders Previous / numbered pages / Next. Kept dumb and controlled —
 * it just reports the page number the user clicked; useObituaries.goToPage
 * (already wired to fetch) does the actual work.
 */
export function PaginationControls({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const navBtnClass = (disabled) => [
    'px-3 py-1.5 rounded-md font-inter text-sm',
    disabled
      ? 'text-muted-foreground cursor-not-allowed opacity-50'
      : 'text-foreground hover:border-border-focus border border-transparent'
  ].join(' ')

  return (
    // <nav> — this is a navigational construct (moving between "pages" of
    // the same content), which is what <nav> exists to mark up, distinct
    // from the share links' <nav> inside each card.
    <nav aria-label="Obituary pages" className="flex items-center justify-center gap-2 mt-8">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className={navBtnClass(page === 1)}>
        Previous
      </button>

      <ul className="flex items-center gap-1">
        {pages.map((p) => (
          <li key={p}>
            <button type="button" onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={[
                'w-8 h-8 rounded-md font-inter text-sm',
                p === page
                  ? 'bg-primary text-cta-foreground'
                  : 'text-foreground hover:border-border-focus border border-transparent'
              ].join(' ')}>
              {p}
            </button>
          </li>
        ))}
      </ul>

      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        className={navBtnClass(page === totalPages)}>
        Next
      </button>
    </nav>
  )
}
