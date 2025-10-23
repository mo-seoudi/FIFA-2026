import React, { useMemo, useState } from 'react'
import Section from '../components/Section.jsx'
import MonthCalendar from '../components/MonthCalendar.jsx'
import EventPopup from '../components/EventPopup.jsx'
import schedule from '../data/schedule.json'

const CITIES = Array.from(new Set(schedule.map(r => r.city))).sort()
const PHASES = ['All', ...Array.from(new Set(schedule.map(r => r.phase))).sort()]

export default function Fifa() {
  // filters + view state
  const [city, setCity] = useState('')
  const [phase, setPhase] = useState('All')
  const [q, setQ] = useState('')
  const [start, setStart] = useState('2026-06-11')
  const [end, setEnd] = useState('2026-07-19')
  const [view, setView] = useState('list') // 'list' | 'calendar'
  const [selected, setSelected] = useState(null)
  const [ym, setYm] = useState({ year: 2026, month: 5 }) // June (0-index)

  const filtered = useMemo(() => {
    return schedule
      .filter(r => {
        if (city && r.city !== city) return false
        if (phase !== 'All' && r.phase !== phase) return false
        if (r.date < start || r.date > end) return false
        if (q) {
          const hay = `${r.fixture} ${r.city} ${r.venue} ${r.phase}`.toLowerCase()
          if (!hay.includes(q.toLowerCase())) return false
        }
        return true
      })
      .sort((a, b) => (a.date === b.date ? a.match_number - b.match_number : a.date.localeCompare(b.date)))
  }, [city, phase, q, start, end])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const r of filtered) {
      if (!map.has(r.date)) map.set(r.date, [])
      map.get(r.date).push(r)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  const calItemsInMonth = useMemo(() => filtered.filter(m => {
    const d = new Date(m.date)
    return d.getFullYear() === ym.year && d.getMonth() === ym.month
  }), [filtered, ym])

  const monthName = (y, m) => new Date(y, m, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' })
  const navMonth = (delta) => {
    const d = new Date(ym.year, ym.month + delta, 1)
    setYm({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <>
      <header className="row" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="h1">FIFA World Cup 2026 — Schedule</h1>
          <p className="sub">City-based table & calendar. Calendar cells show <em>city only</em>; click for details.</p>
        </div>
        <div className="toggle">
          <button className={`btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
          <button className={`btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>Calendar</button>
        </div>
      </header>

      {/* Filters */}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
        <div>
          <label className="sub" style={{ display: 'block' }}>City</label>
          <select value={city} onChange={e => setCity(e.target.value)}>
            <option value="">All cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="sub" style={{ display: 'block' }}>Phase</label>
          <select value={phase} onChange={e => setPhase(e.target.value)}>
            {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="sub" style={{ display: 'block' }}>From</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="input" />
        </div>
        <div>
          <label className="sub" style={{ display: 'block' }}>To</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="input" />
        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <input
          placeholder="Search (e.g., Group E, Monterrey)"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="input"
          style={{ flex: 1 }}
        />
        <button
          onClick={() => { setCity(''); setPhase('All'); setQ(''); setStart('2026-06-11'); setEnd('2026-07-19'); }}
          className="reset"
        >
          Reset
        </button>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <Section title={`Matches (${filtered.length})`}>
          {grouped.length === 0 && <div className="muted">No matches for current filters.</div>}
          <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
            {grouped.map(([date, items]) => (
              <div key={date} className="card">
                <div className="date-row">
                  <div className="date-title">
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <span className="muted">{items.length} match{items.length > 1 ? 'es' : ''}</span>
                </div>
                <ul className="ul">
                  {items.map(m => (
                    <li key={m.match_number} className="li">
                      <div style={{ fontWeight: 600 }}>#{m.match_number}</div>
                      <div>{m.phase}</div>
                      <div style={{ fontWeight: 600 }}>{m.fixture}</div>
                      <div style={{ color: '#6b7280' }}>{m.city} · {m.venue}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* CALENDAR VIEW */}
      {view === 'calendar' && (
        <Section
          title="Month view"
          right={
            <div className="row" style={{ gap: 8 }}>
              <button className="reset" onClick={() => navMonth(-1)}>Prev</button>
              <div style={{ fontSize: 13, fontWeight: 600, width: 140, textAlign: 'center' }}>
                {monthName(ym.year, ym.month)}
              </div>
              <button className="reset" onClick={() => navMonth(1)}>Next</button>
              <button className="reset" onClick={() => setYm({ year: 2026, month: 5 })}>June 2026</button>
              <button className="reset" onClick={() => setYm({ year: 2026, month: 6 })}>July 2026</button>
            </div>
          }
        >
          <MonthCalendar items={calItemsInMonth} onSelect={setSelected} ym={ym} />
        </Section>
      )}

      <EventPopup match={selected} onClose={() => setSelected(null)} />

      <footer className="muted" style={{ marginTop: 28 }}>
        Static JSON data. Calendar cells show <strong>city only</strong>; click for details.
      </footer>
    </>
  )
}
