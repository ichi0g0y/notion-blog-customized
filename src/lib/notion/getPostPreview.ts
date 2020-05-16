import { loadPageChunk, getCover } from './getPageData'
import { values } from './rpc'

const nonPreviewTypes = new Set(['editor', 'page', 'collection_view'])

export async function getPostPreview(pageId: string) {
  let blocks
  let dividerIndex = 0

  const data = await loadPageChunk({ pageId, limit: 10 })
  let cover = null
  blocks = values(data.recordMap.block)
  if (blocks[0] && blocks[0].value.content) cover = getCover(blocks[0].value)
  for (let i = 0; i < blocks.length; i++) {
    if (
      blocks[i].value.type === 'divider' ||
      blocks[i].value.type === 'table_of_contents'
    ) {
      dividerIndex = i
      break
    }
  }

  blocks = blocks
    .splice(0, dividerIndex)
    .filter(
      ({ value: { type, properties } }: any) =>
        !nonPreviewTypes.has(type) && properties
    )
    .map((block: any) => block.value.properties.title)

  return { cover, blocks }
}
