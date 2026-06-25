import { setupWorker } from 'msw/browser';
import { exploreHandlers } from './explore-api.handlers';

export const worker = setupWorker(...exploreHandlers);
