const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const posts = await graphql(`
    query {
      posts: allMarkdownRemark {
        edges {
          node {
            html
            frontmatter {
              description
              path
              title
            }
          }
        }
      }
    }
  `)

  posts?.data?.posts.edges.map(post => {
    console.log('posts', JSON.stringify(post, null, 2))
    const template = path.resolve('src/templates/post.js')
    createPage({
      path: post?.node?.frontmatter?.path,
      component: template,
      context: {
        id: post?.node?.frontmatter?.path,
      }
    })
  })

  // pagination
  const pageSize = 2
  const totalPosts = posts?.data?.posts?.edges?.length
  const numPages = Math.ceil(totalPosts / pageSize)
  const templateBlog = path.resolve('src/templates/blog.js')
  console.log('numPages', numPages)
  
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