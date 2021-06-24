import React from 'react'

const Author = (props) => {
  return (
    <div>
      <h1>Author</h1>
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  )
}

export default Author