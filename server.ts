import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.post('/api/book', async (req, res) => {
    const { name, email, phone, checkIn, checkOut, guests, message } = req.body;

    // Basic Validation
    if (!name || !email || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ error: 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.' });
    }

    console.log('=== ΝΕΟ ΑΙΤΗΜΑ ΚΡΑΤΗΣΗΣ ===');
    console.log(`Ονοματεπώνυμο: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Τηλέφωνο: ${phone}`);
    console.log(`Ημερομηνίες: ${checkIn} - ${checkOut}`);
    console.log(`Επισκέπτες: ${guests}`);
    console.log(`Μήνυμα:\n${message}`);
    console.log('============================');

    // In a production environment, you would use an email service API key (like Resend)
    // or nodemailer with an SMTP server to forward this to the owner.
    // Example:
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ to: 'owner@lithos.gr', subject: 'Νέα κράτηση', text: ... })

    // We respond with success to simulate the booking request completion
    res.json({ success: true, message: 'Το αίτημα σας στάλθηκε με επιτυχία! Θα επικοινωνήσουμε σύντομα μαζί σας.' });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
