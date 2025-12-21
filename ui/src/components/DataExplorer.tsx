import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import {
  Folder as FolderIcon,
  TableChart as TableChartIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

interface Table {
  name: string;
  count: number;
}

const DataExplorer: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      // Mock data - in real implementation, this would query SurrealDB
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTables: Table[] = [
        { name: 'users', count: 15 },
        { name: 'posts', count: 42 },
        { name: 'comments', count: 128 },
        { name: 'categories', count: 8 },
      ];
      
      setTables(mockTables);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async (tableName: string) => {
    setSelectedTable(tableName);
    setLoading(true);
    
    try {
      // Mock data - in real implementation, this would query SurrealDB
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockData = [
        {
          id: `${tableName}:1`,
          name: 'Sample Record 1',
          created_at: new Date().toISOString(),
          status: 'active',
        },
        {
          id: `${tableName}:2`,
          name: 'Sample Record 2',
          created_at: new Date().toISOString(),
          status: 'inactive',
        },
        {
          id: `${tableName}:3`,
          name: 'Sample Record 3',
          created_at: new Date().toISOString(),
          status: 'active',
        },
      ];
      
      setTableData(mockData);
    } catch (error) {
      console.error('Error loading table data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <StorageIcon color="primary" fontSize="large" />
        <Typography variant="h5">Data Explorer</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadTables}
          disabled={loading}
          size="small"
        >
          Refresh
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <FolderIcon fontSize="small" />
              <Typography variant="h6">Tables</Typography>
              <Chip label={tables.length} size="small" />
            </Stack>

            <List>
              {tables.map((table) => (
                <ListItem key={table.name} disablePadding>
                  <ListItemButton
                    selected={selectedTable === table.name}
                    onClick={() => loadTableData(table.name)}
                  >
                    <ListItemIcon>
                      <TableChartIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={table.name}
                      secondary={`${table.count} records`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {tables.length === 0 && !loading && (
              <Typography variant="body2" color="text.secondary" align="center">
                No tables found
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          {selectedTable ? (
            <Paper elevation={2} sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  {selectedTable}
                </Typography>
                <Chip label={`${tableData.length} records`} />
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {tableData.length > 0 &&
                        Object.keys(tableData[0]).map((key) => (
                          <TableCell key={key}>
                            <strong>{key}</strong>
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index} hover>
                        {Object.values(row).map((value: any, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {tableData.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No data found in this table
                  </Typography>
                </Box>
              )}
            </Paper>
          ) : (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
              <StorageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Select a table to view its data
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataExplorer;
