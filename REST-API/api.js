import path from "path"; // Add this line to import the 'path' module
import getRoutes from "./url.js";
import client from "./connection.js";
import express from "express";
import { createServer } from "https";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
const dir = path.join(process.cwd(), "..");
const app = express();
const httpsOptions = {
    cert: fs.readFileSync("/etc/letsencrypt/live/study.com/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/study.com/privkey.pem"),
};
const httpServer = createServer(httpsOptions, app);
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "*", // Allow requests from any origin (you may want to restrict this to your frontend origin in production)
        methods: "GET, POST, PUT, DELETE", // Specify the allowed HTTP methods
        allowedHeaders: "Content-Type, Authorization", // Specify the allowed request headers
        credentials: true, // Enable sending cookies in cross-origin requests (if you are using cookies for sessions)
    })
);

// Static files
app.use(express.static(path.join(process.cwd(), "..", "/public"), { "Content-Type": "text/javascript" }));

// Session handling
const sessions = {};

app.post("/admin", (req, res) => {
    const { username, password } = req.body;
    // console.log("Received username:", username);
    // console.log("Received password:", password);
    // console.log("Expected username:", process.env.USERNAME);
    // console.log("Expected password:", process.env.PASSWORD);
    if (password === process.env.PASSWORD && username === process.env.USERNAME) {
        const sessionId = uuidv4();
        sessions[sessionId] = { username, userId: 1 };
        res.cookie("session", sessionId, { httpOnly: true });
        return res.sendFile(path.join(dir, "/public/pages/admin.html"));
    } else {
        return res.status(401).sendFile(path.join(dir, "/public/pages/no.html"));
    }
});

// Socket.io connection
io.on("connection", (socket) => {
    client.query(`Select * from sitedata`, (err, result) => {
        if (!err) {
            // console.log(result.rows);
            socket.emit("message", result.rows);
        }
    });
    socket.on("message", () => {
        client.query(`Select * from sitedata`, (err, result) => {
            if (!err) {
                // console.log(result.rows);
                io.emit("message", result.rows);
            }
        });
    });
});

// Post data to site
// app.post("/site/post", (req, res) => {
//     try {
//         const sessionId = req.headers.cookie.split("=")[1];
//         console.log(sessionId);
//         const userSession = sessions[sessionId];
//         let insertQuery = `insert into sitedata("group", race, site)
//                     VALUES ($1, $2, $3)`;
//         let values = [req.body.group, req.body.race, parseInt(req.body.site)];
//         if (userSession) {
//             client.query(insertQuery, values, (err, result) => {
//                 if (!err) {
//                     let dataObject = {
//                         group: req.body.group,
//                         race: req.body.race,
//                         site: parseInt(req.body.site),
//                     };
//                     io.emit("data", dataObject);
//                     return res.sendFile(path.join(dir, "/public/pages/admin.html"));
//                 } else {
//                     console.error(err); // Log the error for debugging
//                     return res.status(400).json({ error: "Something went wrong" });
//                 }
//             });
//         } else {
//             return res.status(401).send("Invalid session");
//         }
//     } catch (err) {
//         console.error(err); // Log the error for debugging
//         return res.status(401).send("Invalid username or password");
//     }
// });

// app.post("/site/post", (req, res) => {
//     try {
//         const sessionId = req.headers.cookie.split("=")[1];
//         const userSession = sessions[sessionId];
//         let insertQuery = `insert into sitedata("group", race, site) VALUES ($1, $2, $3)`;

//         // Validate the site value before parsing
//         const siteValue = parseInt(req.body.site);
//         if (isNaN(siteValue) || siteValue <= 0) {
//             return res.status(400).json({ error: "Invalid site value. It should be a positive integer." });
//         }

//         let values = [req.body.group, req.body.race, siteValue];
//         if (userSession) {
//             client.query(insertQuery, values, (err, result) => {
//                 if (!err) {
//                     let dataObject = {
//                         group: req.body.group,
//                         race: req.body.race,
//                         site: siteValue,
//                     };
//                     io.emit("data", dataObject);
//                     return res.sendFile(path.join(dir, "/public/pages/admin.html"));
//                 } else {
//                     console.error(err); // Log the error for debugging
//                     return res.status(400).json({ error: "Something went wrong" });
//                 }
//             });
//         } else {
//             return res.status(401).send("Invalid session");
//         }
//     } catch (err) {
//         console.error(err); // Log the error for debugging
//         return res.status(401).send("Invalid username or password");
//     }
// });

app.post("/site/post", (req, res) => {
    try {
        const sessionId = req.headers.cookie.split("=")[1];
        const userSession = sessions[sessionId];
        let insertQuery = `insert into sitedata("group", race, site) VALUES ($1, $2, $3)`;

        // Validate the site value before parsing
        const siteValue = parseInt(req.body.site);
        if (isNaN(siteValue) || siteValue <= 0) {
            return res.status(400).json({ error: "Invalid site value. It should be a positive integer." });
        }

        let values = [req.body.group, req.body.race, siteValue];
        if (userSession) {
            client.query(insertQuery, values, (err, result) => {
                if (!err) {
                    let dataObject = {
                        group: req.body.group,
                        race: req.body.race,
                        site: siteValue,
                    };
                    io.emit("data", dataObject);
                    return res.sendFile(path.join(dir, "/public/pages/admin.html"));
                } else {
                    console.error(err); // Log the error for debugging
                    return res.status(400).json({ error: "Something went wrong" });
                }
            });
        } else {
            return res.status(401).send("Invalid session");
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(401).send("Invalid username or password");
    }
});

// Routes
app.get("/prompt", (req, res) => {
    res.sendFile(path.join(dir, "/public/pages/prompt.html"));
});

app.get("/admin", (req, res) => {
    const sessionId = req.cookies.session; // Get the session ID from the cookies
    const userSession = sessions[sessionId];

    // Check if the user has a valid session
    if (userSession) {
        return res.sendFile(path.join(dir, "/public/pages/admin.html"));
    } else {
        return res.sendStatus(401);
    }
});

getRoutes(app, dir);

// Socket.io listen
io.listen(8001); // Assuming you want to use a different port for socket.io

// Express listen
httpServer.listen(8443, () => console.log("Listening"));

// Establish database connection
client.connect();
