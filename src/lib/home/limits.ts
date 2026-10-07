/** Hard caps for Home. The page should stay quiet even if a source is noisy. */
export const HOME_LIMITS = {
  startHere: 1,
  priorities: 3,
  emails: 3,
  news: 3,
  attention: 1,
  events: 5,
} as const;
