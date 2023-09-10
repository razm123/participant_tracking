import path from "path"; // Add this line to import the 'path' module

export default function getRoutes(app, dir) {
    // Existing route definitions are commented out
    // ...

    // Additional route definitions
    app.get("/", (req, res) => {
        res.sendFile(path.join(dir, "/public/pages/index.html"));
    });

    app.get("/site1", (req, res) => {
        res.sendFile(path.join(dir, "/public/pages/site1.html"));
    });

    app.get("/site2", (req, res) => {
        res.sendFile(path.join(dir, "/public/pages/site2.html"));
    });

    app.get("/site3", (req, res) => {
        res.sendFile(path.join(dir, "/public/pages/site3.html"));
    });
}
