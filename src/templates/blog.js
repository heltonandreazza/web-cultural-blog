import React from 'react'
import { graphql, Link } from 'gatsby'
import Seo from '../components/Seo'
import Img from 'gatsby-image'

const Blog = ({ data, pageContext }) => {
  const { allMarkdownRemark: { edges: posts } = {} } = data
  const pages = Array.from({ length: pageContext.numPages })
  return (
    <div>
      <Seo title='Blog Academia Cultural' />
      <h1>Blog</h1>
      {
        posts.map(({ node: { frontmatter: { title, path, description, banner } } = {} }) => (
          <div key={title}>
            {banner && <Img fluid={banner.childImageSharp.fluid} />}
            <h3>
              <Link to={path}>{title}</Link>
            </h3>
            <p>{description}</p>
          </div>
        ))
      }
      <ul>
        {
          pages.map((_, i) => (
            <li>
              <Link to={`/blog${(i === 0 ? '' : `/${i}`)}`}>
              {pageContext.currentPage === i && ' >> '}{i + 1}
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    allMarkdownRemark(skip: $skip, limit: $limit) {
      edges {
        node {
          html
          frontmatter {
            description
            path
            title
            banner {
              childImageSharp {
                fluid(maxWidth: 540) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`

export default Blog