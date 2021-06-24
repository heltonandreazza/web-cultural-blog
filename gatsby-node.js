const path = require('path')

// add collection field in order to filter by authors, pages nodes
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const contentInstaceName = getNode(node?.parent)?.sourceInstanceName // authors,pages...
    createNodeField({
      name: 'collection',
      node,
      value: contentInstaceName
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const posts = await graphql(`
    query {
      posts: allMarkdownRemark(filter: {fields: {collection: {eq: "pages"}}}) {
        edges {
          node {
            frontmatter {
              description
              path
              title
            }
          }
        }
      }
      authors: allMarkdownRemark(filter: {fields: {collection: {eq: "authors"}}}) {
        edges {
          node {
            frontmatter {
              title
            }
          }
        }
      }
    }
  `)

  const templatePost = path.resolve('src/templates/post.js')
  posts?.data?.posts.edges.map(post => {
    // console.log('posts', JSON.stringify(post, null, 2))
    createPage({
      path: post?.node?.frontmatter?.path,
      component: templatePost,
      context: {
        id: post?.node?.frontmatter?.path,
      }
    })
  })

  const templateAuthor = path.resolve('src/templates/author.js')
  posts?.data?.authors.edges.map(author => {
    console.log('author', JSON.stringify(author, null, 2))
    createPage({
      path: author?.node?.frontmatter?.title,
      component: templateAuthor,
      context: {
        id: author?.node?.frontmatter?.title,
      }
    })
  })

  // pagination
  const pageSize = 2
  const totalPosts = posts?.data?.posts?.edges?.length
  const numPages = Math.ceil(totalPosts / pageSize)
  const templateBlog = path.resolve('src/templates/blog.js')
  // console.log('numPages', numPages)
  
  Array
    .from({ length: numPages })
    .forEach((_, i) => {
      console.log('gen', '/blog' + (i == 0 ? '' : `/${i}`))
      createPage({
        path: '/blog' + (i == 0 ? '' : `/${i}`),
        component: templateBlog,
        context: {
          limit: pageSize,
          skip: i * pageSize,
          numPages,
          currentPage: i
        }
      })
    })
}