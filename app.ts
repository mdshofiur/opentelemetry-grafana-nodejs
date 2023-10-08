/*app.ts*/
import express, { Express, Request, Response } from 'express';
import opentelemetry from '@opentelemetry/api';

const PORT: number = parseInt(process.env.PORT || '8080');
const app: Express = express();

function getRandomNumber(min: number, max: number) {
   return Math.floor(Math.random() * (max - min) + min);
}

const myMeter = opentelemetry.metrics.getMeter('my-service-meter');

app.get('/rolldice', (req, res) => {
   res.send(getRandomNumber(1, 6).toString());
});

app.get('/', (req: Request, res: Response) => {
   const histogram = myMeter.createHistogram('task.duration');
   const startTime = new Date().getTime();

   // do some work in an API call

   const endTime = new Date().getTime();
   const executionTime = endTime - startTime;

   // Record the duration of the task operation
   histogram.record(executionTime);
   res.json({
      message: 'Hello World!',
      executionTime,
   });
});

app.listen(PORT, () => {
   console.log(`Listening for requests on http://localhost:${PORT}`);
});
