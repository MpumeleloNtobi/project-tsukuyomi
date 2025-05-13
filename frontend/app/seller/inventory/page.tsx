'use client'

import Link from 'next/link'

export default function ReportingDashboardPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Seller Reporting</h1>
      <Link href="/seller/inventory">
        <div style={{
          border: '1px solid #000',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem',
          width: 'fit-content',
          cursor: 'pointer'
        }}>
          📦 Inventory Report
        </div>
      </Link>
    </div>
  )
}