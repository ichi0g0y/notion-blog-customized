import rpc, { values } from './rpc'

export default async function getPageData(pageId: string) {
  try {
    const data = await loadPageChunk({ pageId })
    const blocks = values(data.recordMap.block)
    let cover = {
      url: null,
      position: null,
      blockId: null,
    }

    if (blocks[0] && blocks[0].value.content) {
      // get cover
      cover = getCover(blocks[0].value)
      // remove table blocks
      blocks.splice(0, 3)
    }

    return { cover, blocks }
  } catch (err) {
    console.error(`Failed to load pageData for ${pageId}`, err)
    return { blocks: [] }
  }
}

export function loadPageChunk({
  pageId,
  limit = 100,
  cursor = { stack: [] },
  chunkNumber = 0,
  verticalColumns = false,
}: any) {
  return rpc('loadPageChunk', {
    pageId,
    limit,
    cursor,
    chunkNumber,
    verticalColumns,
  })
}

export function getCover(value) {
  if (!value.format?.page_cover) return null
  return {
    url: value.format?.page_cover,
    position: value.format?.page_position || null,
    blockId: value.id || null,
  }
}
