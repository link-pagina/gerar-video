import handler from './generate';

export default async function generateStep3Endpoint(req: any, res: any) {
  if (req.body && typeof req.body === 'object') {
    if (!req.body.action) {
      req.body.action = 'step-3';
    }
  }
  return handler(req, res);
}
