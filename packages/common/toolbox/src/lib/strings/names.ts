/**
 * Return the locale-capitalized initials of the input name.
 * Returns an empty string if the input string isn't suitable for initialization.
 *
 * Useful for avatars, menus, etc.
 *
 * Adapted from https://stackoverflow.com/a/63763497/9171738
 */
export function getNameInitials(input: string): string {
  return (
    input
      .match(/(^\S\S?|\s\S)?/g)
      ?.map((v) => v.trim())
      .join('')
      .match(/(^\S|\S$)?/g)
      ?.join('')
      .toLocaleUpperCase() || ''
  )
}
