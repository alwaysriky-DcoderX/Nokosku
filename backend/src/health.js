// Custom health check endpoint
app.get('/api/v1/health', (req, res) => {
  const timestamp = new Date().toISOString();
  res.json({
    status: 'ok',
    timestamp,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});