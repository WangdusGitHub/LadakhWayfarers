import type { Plugin } from 'vite';
import { connectToDatabase, Tour, Review, Gallery, DriverConfig } from './api/_db';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

export function devApiPlugin(): Plugin {
  let isDbReady = false;

  const initDb = async () => {
    if (isDbReady) return;
    try {
      await connectToDatabase();
      isDbReady = true;
      console.log('⚡ [Vite Dev API] MongoDB Atlas connected successfully.');
    } catch (e: any) {
      console.warn('⚠️ [Vite Dev API] MongoDB connection notice:', e.message);
    }
  };

  return {
    name: 'dev-api-plugin',
    apply: 'serve', // Runs exclusively during local development server, disabled during build
    configureServer(server) {
      initDb();
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = url.pathname;
        const method = req.method;

        // Ensure database is connected
        await initDb();

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        // Helper to parse JSON body
        const readBody = async (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                resolve({});
              }
            });
          });
        };

        try {
          // Status
          if (pathname === '/api/status' && method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify({
              mongodb: { connected: isDbReady },
              cloudinary: {
                configured: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
                cloudName: process.env.CLOUDINARY_CLOUD_NAME || null
              }
            }));
          }

          // Driver Config
          if (pathname === '/api/driver-config') {
            if (method === 'GET') {
              const config = await DriverConfig.findOne().sort({ updatedAt: -1 });
              res.statusCode = 200;
              return res.end(JSON.stringify(config || {}));
            }
            if (method === 'PUT') {
              const body = await readBody();
              const updated = await DriverConfig.findOneAndUpdate({}, body, { new: true, upsert: true });
              res.statusCode = 200;
              return res.end(JSON.stringify(updated));
            }
          }

          // Tours
          if (pathname === '/api/tours') {
            if (method === 'GET') {
              const tours = await Tour.find().sort({ createdAt: -1 });
              res.statusCode = 200;
              return res.end(JSON.stringify(tours));
            }
            if (method === 'POST') {
              const body = await readBody();
              if (!body.id) body.id = 'tour-' + Date.now();
              const created = await Tour.create(body);
              res.statusCode = 201;
              return res.end(JSON.stringify(created));
            }
          }

          // Gallery
          if (pathname === '/api/gallery') {
            if (method === 'GET') {
              const gallery = await Gallery.find().sort({ createdAt: -1 });
              res.statusCode = 200;
              return res.end(JSON.stringify(gallery));
            }
            if (method === 'POST') {
              const body = await readBody();
              if (!body.id) body.id = 'gal-' + Date.now();
              const created = await Gallery.create(body);
              res.statusCode = 201;
              return res.end(JSON.stringify(created));
            }
          }

          // Reviews
          if (pathname === '/api/reviews') {
            if (method === 'GET') {
              const reviews = await Review.find().sort({ createdAt: -1 });
              res.statusCode = 200;
              return res.end(JSON.stringify(reviews));
            }
            if (method === 'POST') {
              const body = await readBody();
              if (!body.id) body.id = 'rev_' + Date.now();
              body.rating = Number(body.rating) || 5;
              body.verified = body.verified !== false;
              body.helpfulCount = Number(body.helpfulCount) || 1;
              const created = await Review.create(body);
              res.statusCode = 201;
              return res.end(JSON.stringify(created));
            }
          }

          // Helpful increment
          if (pathname.startsWith('/api/reviews/') && pathname.endsWith('/helpful') && method === 'POST') {
            const id = pathname.replace('/api/reviews/', '').replace('/helpful', '');
            const updated = await Review.findOneAndUpdate({ id }, { $inc: { helpfulCount: 1 } }, { new: true });
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, helpfulCount: updated?.helpfulCount || 1 }));
          }

          // If no route matched
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Endpoint not found' }));
        } catch (err: any) {
          console.error('Vite dev API error:', err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}
