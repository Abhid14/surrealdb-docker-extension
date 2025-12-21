import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  Paper,
  Alert,
} from '@mui/material';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import DatabaseManager from './components/DatabaseManager';
import QueryEditor from './components/QueryEditor';
import DataExplorer from './components/DataExplorer';
import Settings from './components/Settings';

const ddClient = createDockerDesktopClient();

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function App() {
  const [tabValue, setTabValue] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    checkSurrealDBStatus();
  }, []);

  const checkSurrealDBStatus = async () => {
    try {
      setConnectionStatus('connecting');
      // Check if SurrealDB container is running
      const result = await ddClient.docker.cli.exec('ps', [
        '--filter',
        'name=surrealdb',
        '--format',
        '{{.Status}}',
      ]);

      if (result.stdout && result.stdout.includes('Up')) {
        setConnectionStatus('connected');
        setErrorMessage('');
      } else {
        setConnectionStatus('disconnected');
        setErrorMessage('SurrealDB container is not running. Please start it from the Database Manager tab.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      setErrorMessage('Failed to check SurrealDB status');
      console.error('Error checking SurrealDB status:', error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          SurrealDB Manager
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Manage your SurrealDB databases directly from Docker Desktop
        </Typography>

        {errorMessage && (
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }} onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        <Paper sx={{ mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="SurrealDB tabs">
            <Tab label="Database Manager" />
            <Tab label="Query Editor" disabled={connectionStatus !== 'connected'} />
            <Tab label="Data Explorer" disabled={connectionStatus !== 'connected'} />
            <Tab label="Settings" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <DatabaseManager 
              onStatusChange={checkSurrealDBStatus}
              connectionStatus={connectionStatus}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <QueryEditor />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <DataExplorer />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Settings />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}
