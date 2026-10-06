// A read-only walk that follows a link whose route answers 302 to localhost, a host the config
// does not list. The route guard only ever sees the link's own URL; the redirect is a hop it
// cannot see, so it is judged from the context's request events, and the browser's own DNS rules
// stand behind it.
export default {
  title: 'Link that redirects to an unlisted host',
  writes: false,
  startPath: '/home',
  async run({ page, rec }) {
    await rec.step('leave', 'Follow the partner link', 'action', async () => {
      await rec.click(page.getByRole('link', { name: 'Visit partner', exact: true }))
      await page.waitForTimeout(1000)
    })
  }
}
