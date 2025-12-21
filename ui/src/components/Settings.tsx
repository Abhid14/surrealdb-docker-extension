import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    host: 'localhost',
    port: '8000',
    username: 'root',
    password: 'root',
    namespace: 'test',
    database: 'test',
    autoConnect: true,
    strictMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
    setSaved(false);
  };

  const handleSave = () => {
    // In a real implementation, save to extension storage
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <SettingsIcon color="primary" fontSize="large" />
        <Typography variant="h5">Settings</Typography>
      </Stack>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure your SurrealDB connection parameters
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Host"
            value={settings.host}
            onChange={handleChange('host')}
            fullWidth
            helperText="The hostname or IP address of your SurrealDB instance"
          />

          <TextField
            label="Port"
            value={settings.port}
            onChange={handleChange('port')}
            fullWidth
            helperText="The port number (default: 8000)"
          />

          <Divider />

          <TextField
            label="Username"
            value={settings.username}
            onChange={handleChange('username')}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={settings.password}
            onChange={handleChange('password')}
            fullWidth
          />

          <Divider />

          <TextField
            label="Namespace"
            value={settings.namespace}
            onChange={handleChange('namespace')}
            fullWidth
            helperText="The namespace to use for your database"
          />

          <TextField
            label="Database"
            value={settings.database}
            onChange={handleChange('database')}
            fullWidth
            helperText="The database name to connect to"
          />

          <Divider />

          <Typography variant="h6">
            Advanced Options
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={settings.autoConnect}
                onChange={handleChange('autoConnect')}
              />
            }
            label="Auto-connect on extension load"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.strictMode}
                onChange={handleChange('strictMode')}
              />
            }
            label="Enable strict mode"
          />

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            Save Settings
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          About SurrealDB Extension
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Version: 0.1.0
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This extension provides a seamless way to manage SurrealDB databases
          directly from Docker Desktop. Features include database management,
          query execution, and data exploration.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          For more information, visit{' '}
          <a
            href="https://surrealdb.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8B5CF6' }}
          >
            surrealdb.com
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
