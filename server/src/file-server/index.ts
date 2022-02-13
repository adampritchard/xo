import path from 'path';
import express, { Express } from 'express';

const buildDir = '../../../client/dist';

type InitParams = { app: Express };

export function initFileServer({ app }: InitParams) {
  app.use(express.static(path.join(__dirname, buildDir)));
  
  // Match '/' or '/XXXX'
  app.get(/^\/([A-Z]{4})?$/, (req, res) => {
    res.sendFile(path.join(__dirname, buildDir, 'index.html'));
  });
}
