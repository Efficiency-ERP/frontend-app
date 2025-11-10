import React, { useMemo, useState } from 'react'
import { LogsContext, type LogsContextType, type LogEntry } from './logs-context'

function seedLogs(): LogEntry[] {
  const now = new Date()
  return [
    { id: 'log-1', timestamp: now.toISOString(), userId: 'user-1', userName: 'John Doe', module: 'invoices', message: 'Created invoice INV-1001', targetId: 'inv-tn-1' },
    { id: 'log-2', timestamp: now.toISOString(), userId: 'user-1', userName: 'John Doe', module: 'contacts', message: 'Updated contact Société Carthage', targetId: 'c-tn-1001' },
    { id: 'log-3', timestamp: now.toISOString(), userId: 'user-1', userName: 'John Doe', module: 'articles', message: 'Added article P-BTL-001', targetId: 'art-tn-1001' },
  ]
}

export default function LogsProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>(seedLogs())

  const value = useMemo<LogsContextType>(() => ({
    logs,
    addLog: (entry: LogEntry) => setLogs((prev) => [entry, ...prev]),
  }), [logs])

  return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>
}