import React from 'react'

export default function Table({ columns = [], data = [] }){
  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map(c => <th key={c} className="text-left p-2 border-b">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((c, i) => <td key={i} className="p-2 border-b">{row[c] ?? ''}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
