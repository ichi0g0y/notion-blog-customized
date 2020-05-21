import Link from 'next/link'
import Header from '../../components/header'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import {
  getBlogLink,
  getDateStr,
  postIsPublished,
  getTagLink,
} from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  let allTags: string[] = []
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      allTags = allTags.concat(post.Tags)
      return post
    })
    .filter(Boolean)

  allTags = allTags.filter((tag, index, orig) => orig.indexOf(tag) === index)
  const { users } = await getNotionUsers([...authorsToGet])

  posts.map(post => {
    post.Authors = post.Authors.map(id => users[id].full_name)
  })

  return {
    props: {
      preview: preview || false,
      posts,
      allTags,
    },
    revalidate: 10,
  }
}

export default ({ posts = [], allTags = [], preview }) => {
  return (
    <>
      <Header titlePre="Blog" />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>My Notion Blog</h1>
        {posts.length === 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
        {posts.length > 0 && allTags.length > 0 && (
          <>
            <div className={blogStyles.tagsTitle}>Tags:</div>
            <div className={blogStyles.tags}>
              {allTags &&
                allTags.length > 0 &&
                allTags.map(tag => (
                  <Link href="/blog/tag/[tag]" as={getTagLink(tag)}>
                    <span className={blogStyles.tag}>{tag}</span>
                  </Link>
                ))}
            </div>
          </>
        )}
        {posts.map(post => {
          return (
            <div className={blogStyles.postPreview} key={post.Slug}>
              {post.cover ? (
                <img
                  src={`/api/asset?assetUrl=${encodeURIComponent(
                    post.cover.url as any
                  )}&blockId=${post.cover.blockId}`}
                  className={blogStyles.postPreviewCover}
                />
              ) : null}
              <h3>
                <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                  <div className={blogStyles.titleContainer}>
                    {!post.Published && (
                      <span className={blogStyles.draftBadge}>Draft</span>
                    )}
                    <a>{post.Page}</a>
                  </div>
                </Link>
              </h3>
              {post.Tags &&
                post.Tags.length > 0 &&
                post.Tags.map(tag => (
                  <Link href="/blog/tag/[tag]" as={getTagLink(tag)}>
                    <span className={blogStyles.tag}>{tag}</span>
                  </Link>
                ))}
              {post.Authors.length > 0 && (
                <div className="authors">By: {post.Authors.join(' ')}</div>
              )}
              {post.Date && (
                <div className="posted">Posted: {getDateStr(post.Date)}</div>
              )}
              <p>
                {(!post.preview || post.preview.length === 0) &&
                  'No preview available'}
                {(post.preview || []).map((block, idx) =>
                  textBlock(block, true, `${post.Slug}${idx}`)
                )}
              </p>
            </div>
          )
        })}
      </div>
    </>
  )
}
