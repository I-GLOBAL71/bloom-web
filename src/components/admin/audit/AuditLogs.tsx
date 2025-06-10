import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';

interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  details: string;
}

export function AuditLogs() {
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Implement actual audit log fetching
    const mockData: AuditLog[] = [
      {
        id: '1',
        timestamp: new Date(),
        action: 'USER_LOGIN',
        user: 'admin@example.com',
        details: 'Successful login'
      }
    ];
    
    setLogs(mockData);
    setLoading(false);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            logs.map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
