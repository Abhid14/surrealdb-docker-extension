import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Clear as ClearIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

const QueryEditor: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM users;');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const exampleQueries = [
    'SELECT * FROM users;',
    'CREATE users SET name = "John", age = 30;',
    'UPDATE users SET age = 31 WHERE name = "John";',
    'DELETE users WHERE name = "John";',
  ];

  const executeQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = performance.now();

    try {
      // In a real implementation, you would use surrealdb.js to connect and execute
      // For this demo, we'll simulate the query execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResult = {
        status: 'OK',
        time: '1.23ms',
        result: [
          {
            id: 'users:1',
            name: 'John Doe',
            age: 30,
            email: 'john@example.com',
          },
          {
            id: 'users:2',
            name: 'Jane Smith',
            age: 25,
            email: 'jane@example.com',
          },
        ],
      };

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setResult(mockResult);
    } catch (err: any) {
      setError(err.message || 'Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  const clearEditor = () => {
    setQuery('');
    setResult(null);
    setError(null);
    setExecutionTime(null);
  };

  const loadExample = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <CodeIcon color="primary" fontSize="large" />
        <Typography variant="h5">Query Editor</Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Write and execute SurrealQL queries against your database
      </Typography>

      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Example Queries:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {exampleQueries.map((exampleQuery, index) => (
            <Chip
              key={index}
              label={exampleQuery.split(' ').slice(0, 3).join(' ') + '...'}
              onClick={() => loadExample(exampleQuery)}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      </Paper>

      <TextField
        fullWidth
        multiline
        rows={10}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
        placeholder="Enter your SurrealQL query here..."
        sx={{
          mb: 2,
          fontFamily: 'monospace',
          '& textarea': {
            fontFamily: 'monospace',
            fontSize: '14px',
          },
        }}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          onClick={executeQuery}
          disabled={loading}
        >
          Execute Query
        </Button>

        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={clearEditor}
          disabled={loading}
        >
          Clear
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Query Results</Typography>
            {executionTime && (
              <Chip
                label={`Execution time: ${executionTime.toFixed(2)}ms`}
                size="small"
                color="success"
              />
            )}
          </Stack>

          <Box
            sx={{
              backgroundColor: '#1e1e1e',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '400px',
            }}
          >
            <pre style={{ margin: 0, color: '#d4d4d4', fontSize: '12px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default QueryEditor;
