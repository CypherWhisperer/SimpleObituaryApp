import { FaInstagram, FaFacebookF, FaWhatsapp } from '@icons'


//  * Renders one obituary entry: collapsed by default (name, date range,
//  * author, 2-line preview), expands on hover OR keyboard focus to reveal
//  * the full text and share links.


export function ObituaryCard({ obituary }) {
  const { name, born_at, died_at, content, author } = obituary

  return (
    // <article> — an obituary is meaningful and distributable on its own
    // (e.g. a future permalink, an RSS/schema.org feed entry).
    // This is <article>'s purpose, unlike a generic <div> or
    // a <section> (which needs a parent context to make sense).

    <article className="group border-b border-border py-6 last:border-b-0">
      <header className="flex items-baseline justify-between gap-4">

        {/* h3: the page itself owns the h1 ("Obituaries"), and each card
            in a flat list of peers is a subsection of that — h3 keeps the
            outline correct without a redundant intermediate h2 per card.
        */}
        <h3 className="font-space-grotesk text-lg font-semibold text-foreground">
          {name}
        </h3>

        {/* <time datetime="..."> — screen readers and any later schema.org
            markup get the machine-readable ISO date even though the
            visible text is reformatted to the YYYY/MM/DD our mock uses.
        */}
        <p className="font-inter text-sm text-muted-foreground whitespace-nowrap">
          <time dateTime={born_at}>{born_at.replaceAll('-', '/')}</time>
          {' – '}
          <time dateTime={died_at}>{died_at.replaceAll('-', '/')}</time>
        </p>
      </header>

      <p className="font-inter text-sm text-muted-foreground mt-1">
        Authored By: <span className="text-foreground">{author}</span>
      </p>

      {/* Collapsed 2-line preview — swaps out for the full text below on
          hover/focus, so there's no layout jump between the two states.
       */}
      <p className="font-inter text-sm text-foreground line-clamp-2 mt-3 group-hover:hidden group-focus-within:hidden">
        {content}
      </p>

      {/* Animating grid-template-rows 0fr -> 1fr is the one clean way to transition toward
          "height: auto" without hardcoding a max-height guess. group-focus-within fires the
          same reveal as group-hover the moment a keyboard user tabs to a link inside — no
          separate keyboard-only code path needed.
      */}
      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
        <div className="overflow-hidden">
          <p className="font-inter text-sm text-foreground leading-relaxed pt-3">
            {content}
          </p>

          {/* <nav><ul> — this is a set of navigational links to external share targets, which
              is what nav+ul represents; a row of bare <button>s would misrepresent them as in-page actions.
          */}
          <nav aria-label={`Share ${name}'s obituary`} className="mt-3">
            <ul className="flex items-center gap-3 text-muted-foreground">
              <li>
                <a href="#" aria-label="Share to Instagram" className="hover:text-primary">
                  <FaInstagram size={16} />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Share to Facebook" className="hover:text-primary">
                  <FaFacebookF size={16} />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Share to WhatsApp" className="hover:text-primary">
                  <FaWhatsapp size={16} />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </article>
  )
}
