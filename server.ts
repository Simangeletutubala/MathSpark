import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { buddyUid, buddyName, appUrl } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "zar",
              product_data: {
                name: `MathSpark Pro - ${buddyName}`,
                description: "Unlock all features, parent portal, and advanced analytics.",
              },
              unit_amount: 19900, // R199.00
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}?payment=success&buddyUid=${buddyUid}`,
        cancel_url: `${appUrl}?payment=cancel`,
        metadata: {
          buddyUid,
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
