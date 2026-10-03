import handler from './generate';

export default async function generateStep1And2Endpoint(req: any, res: any) {
  if (req.body && typeof req.body === 'object') {
    if (!req.body.action) {
      req.body.action = 'step-1-2';
    }
  }
  return handler(req, res);
}
