import express from 'express';
import v1Router from './src/routers/v1/index.router';
const app = express();
app.use('/api/v1', v1Router);
app.listen(3005, () => {
  console.log("Test server running on 3005");
});
