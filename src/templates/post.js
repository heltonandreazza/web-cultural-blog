import React from 'react'
import { graphql, Link } from 'gatsby'
import Seo from '../components/Seo'
import Img from 'gatsby-image'
import { Disqus } from 'gatsby-plugin-disqus';

const Post = ({ data: { markdownRemark: { frontmatter, html } = {} } = {} }) => {
  console.log(frontmatter, html)
  return (
    <div>
      <Seo title={frontmatter?.title} description={frontmatter.description} />
      {frontmatter?.banner && <Img fluid={frontmatter?.banner.childImageSharp.fluid} />}
      <h1>{frontmatter?.title}</h1>
      <p>
        <Link to={'/blog'}>Voltar para o blog</Link>
      </p>
      <p>{frontmatter?.description}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Disqus
        config={{
          identifier: frontmatter?.path,
          title: frontmatter?.title,
          url: 'http://localhost:8000/blog',
        }}
      />
    </div>
  )
}

export const pageQuery = graphql`
  query($id: String!){
    markdownRemark(frontmatter: {path: {eq: $id}}) {
      frontmatter {
        path
        title
        description
        banner {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      html
    }
  }
`

export default Post