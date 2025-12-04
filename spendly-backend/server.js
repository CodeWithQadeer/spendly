const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Security & performance middleware
// Allow one or more comma-separated origins in CLIENT_ORIGIN for dev/prod.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((o) => o.trim());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);

// Proper CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (no origin) and configured frontend origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "auth-token"],
  })
);

// Handle preflight for all routes
app.options("*", cors());

app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/balance", require("./routes/balanceRoutes"));
app.use("/transactions", require("./routes/transactionRoutes"));
app.use("/loan", require("./routes/loanRoutes"));

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
