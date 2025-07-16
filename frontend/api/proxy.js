export default async function proxy(req, res) {
  const API_URL = process.env.VITE_SERVER_URL;
  const path = req.url.replace('/api', '');
  const url = `${API_URL}${path}`;

  const headers = { ...req.headers };
  delete headers.host;

  // Handle body for non-GET/HEAD
  let body = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => (data += chunk));
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });
  }

  const response = await fetch(url, {
    method: req.method,
    headers,
    body,
  });

  // Forward status code
  res.status(response.status);

  // Forward headers, including multiple Set-Cookie headers
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === 'set-cookie') {
      res.appendHeader('Set-Cookie', value);
    } else {
      res.setHeader(key, value);
    }
  }

  res.removeHeader('content-length'); // Avoid mismatch

  // Forward response body
  const buffer = await response.arrayBuffer();
  res.send(Buffer.from(buffer));
}
