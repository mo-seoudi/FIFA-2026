import React from 'react'

export default function Section({ title, right, children }) {
  return (
    <section>
      <div className="section-row">
        <h2 className="section-title">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}
