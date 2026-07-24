import { useObituaryList } from '@hooks'
import { ObituaryCard, PaginationControls } from '@obituaryComponents'

export function ObituaryList({ onNavigateToSubmit }) {
  const { entries, page, totalPages, loading, error, goToPage } = useObituaryList()
  const isEmpty = !loading && !error && entries.length === 0

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* An h1 anchors the document outline for screen readers and search engines */}
      <h1 className="sr-only">Obituaries</h1>

      {/* ADD ENTRY sits at the top only once there's a list to sit. In the empty state, it's centered
          below the message instead.
       */}
      {!isEmpty && (
        <button type="button" onClick={onNavigateToSubmit}
          className="w-full rounded-md bg-cta py-2.5 font-space-grotesk font-semibold text-cta-foreground mb-10">
          ADD ENTRY
        </button>
      )}

      {loading && <p className="text-center font-inter text-muted-foreground">Loading...</p>}

      {error && !loading && <p className="text-center font-inter text-border-error">{error}</p>}

      {isEmpty && (
        <div className="flex flex-col items-center gap-6 py-20">
          <p className="font-space-grotesk text-lg text-muted-foreground">
            There Are Currently No Entries
          </p>
          <button type="button" onClick={onNavigateToSubmit}
            className="rounded-md bg-cta px-8 py-2.5 font-space-grotesk font-semibold text-cta-foreground">
            ADD ENTRY
          </button>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (

        // h2's job is structural: it keeps each card's h3 a legitimate one level down,
        //  instead of skipping straight from h1 to h3.
        <section aria-label="Entries">
          <h2 className="sr-only">Latest Entries</h2>
          {entries.map((entry) => (
            <ObituaryCard key={entry.id} obituary={entry} />
          ))}
          <PaginationControls page={page} totalPages={totalPages} onPageChange={goToPage} />
        </section>
      )}
    </main>
  )
}
