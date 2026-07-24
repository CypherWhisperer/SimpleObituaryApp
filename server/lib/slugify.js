// Turns a name into a URL-friendly slug. withId() appends the row's own id
// afterward, so two "John Doe" entries never collide on the UNIQUE constraint.

export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // strip anything not a letter, digit, space or hyphen
    .replace(/\s+/g, '-')          // collapse whitespace into hyphens
    .replace(/-+/g, '-')           // collapse repeated hyphens
}

export function withId(baseSlug, id) {
  return `${baseSlug}-${id}`
}
