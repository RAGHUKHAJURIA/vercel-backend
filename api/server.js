// const express = require("express");
// const colors = require("colors");
// const morgan = require("morgan");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// // const cors = require('cors');


// //config dotenv
// dotenv.config();

// //mongodb connection
// connectDB();

// //rest object
// const app = express();

// //middlewares
// app.use(express.json());
// app.use(morgan("dev"));

// //routes

// app.get('/', (req, res) => {
//     res.send({
//         activeStatus: true,
//         error: false,
//     })
// })



// app.use("/api/v1/user", require("./routes/userRoutes"));
// app.use("/api/v1/admin", require("./routes/adminRoutes"));
// app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

// // app.use(cors({
// //     origin: '*', // or use '*' to allow all origins (not recommended for production)
// //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //     allowedHeaders: ['Content-Type', 'Authorization']
// // }));


// //listen port
// const port = process.env.PORT || 8080 // this line shows that there is environmental variable that is used when we snd our code for production

// app.listen(port, () => {
//     console.log(`sever running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`.bgCyan.white
//     );
// })





// const express = require("express");
// const colors = require("colors");
// const morgan = require("morgan");
// const dotenv = require("dotenv");
// const connectDB = require("../config/db");
// const cors = require('cors');

// // Load environment variables
// dotenv.config();

// // Create Express app
// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(morgan("dev"));
// app.use(cors({
//     origin: process.env.FRONTEND_URL || "*",
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Routes
// app.get('/', (req, res) => {
//     res.status(200).json({
//         activeStatus: true,
//         error: false,
//         message: "Doctor Appointment API is running"
//     });
// });

// app.use("/api/v1/user", require("../routes/userRoutes"));
// app.use("/api/v1/admin", require("../routes/adminRoutes"));
// app.use("/api/v1/doctor", require("../routes/doctorRoutes"));

// // Error handling middleware (important for Vercel)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong!' });
// });

// // Database connection (with Vercel-specific handling)
// if (process.env.NODE_ENV !== 'test') {
//     connectDB().then(() => {
//         console.log('MongoDB connected'.bgGreen.white);
//     }).catch(err => {
//         console.error('MongoDB connection error:'.bgRed.white, err);
//     });
// }

// // Export the app for Vercel
// module.exports = app;

// // Start server only when not in Vercel environment
// if (process.env.VERCEL !== '1') {
//     const port = process.env.PORT || 8080;
//     app.listen(port, () => {
//         console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.bgCyan.white);
//     });
// }


const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic test route
app.get("/", (req, res) => {
    res.status(200).json({ activeStatus: true, error: false });
});

// API routes
app.use("/api/v1/user", require("../routes/userRoutes"));
app.use("/api/v1/admin", require("../routes/adminRoutes"));
app.use("/api/v1/doctor", require("../routes/doctorRoutes"));

// Connect to DB (optional async/await with .then)
connectDB();

module.exports = app; // Export for Vercel
