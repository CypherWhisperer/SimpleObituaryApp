import { useState } from 'react'
import { ObituaryList, SubmitObituary } from '@pages'

export default function App() {
  // No router pulled in — this app has exactly two views and no need for deep-linkable
  // URLs for a course test, so a plain state toggle avoids an unused dependency.

  // *NOTE: Revisit if this ever needs shareable links to individual obituaries
  // *      (which the `slug` column already sets us up for).
  const [view, setView] = useState('list')

  return view === 'list'
    ? <ObituaryList onNavigateToSubmit={() => setView('submit')} />
    : <SubmitObituary onNavigateToList={() => setView('list')} />
}
