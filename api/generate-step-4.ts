import handler from './generate';

export default async function generateStep4Endpoint(req: any, res: any) {
  if (req.body && typeof req.body === 'object') {
    if (!req.body.action) {
      req.body.action = 'step-4';
    }
  }
  return handler(req, res);
}
