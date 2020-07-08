import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useKirbyAPI } from './useKirbyApi'

/**
 * Hook for the corresponding page of the current path
 *
 * @returns {object} Current page object
 */
export const usePage = () => {
  const { path } = useRoute()
  const { getPage } = useKirbyAPI()

  // Setup up page waiter
  let resolve
  let promise = new Promise(r => { // eslint-disable-line promise/param-names
    resolve = r
  })

  // Transform route `path` to `pageId` for use with api
  const pageId = (path.endsWith('/') ? path.slice(0, -1) : path).slice(1) || 'home'

  // Setup reactive `page` object with some commonly used keys
  const page = reactive({
    title: null,
    metaTitle: null,
    children: null,
    text: null
  })

  /**
   * @example
   * (async () => {
   *   await page.isLoaded
   *   document.title = page.metaTitle
   * })()
   */
  Object.defineProperty(page, 'isLoaded', {
    get: () => promise
  })

  ;(async () => {
    // Get page from cache or freshly fetch it
    Object.assign(page, { ...(await getPage(pageId)) })

    // Set document title
    document.title = page.metaTitle

    // Flush page waiter
    resolve && resolve()
    resolve = undefined
    promise = undefined
  })()

  return page
}
