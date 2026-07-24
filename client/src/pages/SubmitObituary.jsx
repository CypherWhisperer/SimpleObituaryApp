import { useSubmitObituary } from '@hooks'
import { ObituaryForm } from '@sectionComponents'

export function SubmitObituary({ onNavigateToList }) {
  const { submitObituary } = useSubmitObituary()

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="sr-only">Submit an Obituary</h1>
      <ObituaryForm onSubmit={submitObituary} onSuccess={onNavigateToList} />
    </main>
  )
}
