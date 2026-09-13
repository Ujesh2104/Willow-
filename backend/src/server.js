import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());

// Support both /api/* and direct /* routing
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Willow Stadium Ticket Engine API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🏏 Willow Stadium Ticket Engine Backend running on http://localhost:${PORT}`);
});
