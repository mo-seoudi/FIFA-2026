import React from 'react'

export default function MonthCalendar({ items, onSelect, ym }) {
  const first = new Date(ym.year, ym.month, 1)
  const firstDay = first.getDay() // 0 Sun - 6 Sat
  const monthStartOffset = (firstDay + 6) % 7 // Monday-first
  const startDate = new Date(ym.year, ym.month, 1 - monthStartOffset)

  const total = 42 // 6 weeks x 7 days
  const cells = []
  for (let i = 0; i < total; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    const inCurrent = d.getMonth() === ym.month
    const dayItems = items.filter(m => m.date === iso)
    cells.push({ date: d, iso, inCurrent, dayItems })
  }

  const weekLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

  return (
    <div className="cal">
      <div className="cal-head">
        {weekLabels.map(w => <div key={w}>{w}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((c, idx) => (
          <div key={idx} className={`day ${c.inCurrent ? '' : 'out'}`}>
            <div className="hdr">
              <span style={{ fontWeight: 600 }}>{c.date.getDate()}</span>
              {c.dayItems.length > 0 && <span className="pill">{c.dayItems.length}</span>}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {c.dayItems.map(m => (
                <button
                  key={m.match_number}
                  className="event"
                  title={m.city}
                  onClick={() => onSelect(m)}
                >
                  {m.city}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
