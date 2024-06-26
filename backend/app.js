// const express = require("express");
// const youtube = require("youtube-api");
// const { v4: uuid } = require("uuid");
// const cors = require("cors");
// const multer = require("multer");
// const open = require("open");
// const fs = require('fs');
// const credential = require('./credentials.json');

// const PORT = 3000;

// const app = express();
// app.use(express.json());
// app.use(cors());

// const storage = multer.diskStorage({
//     destination: './',
//     filename (req, file, cb) {
//         const newFileName = `${uuid()}-${file.originalname}`;
//         cb(null, newFileName);
//     }
// });

// const uploadVideoFile = multer({
//     storage: storage
// }).single("videoFile");

// app.post('/upload', uploadVideoFile, (req, res) => {
//     if (req.file) {
//         const filename = req.file.filename;
//         const { title, description } = req.body;

//         open(OAuth.generateAuthUrl({
//             access_type: 'offline',
//             scope: 'https://www.googleapis.com/auth/youtube.upload',
//             state: JSON.stringify({
//                 filename,
//                 title,
//                 description
//             })
//         }));
//     }
// });

// app.get('/oauth2callback', (req, res) => {
//     res.redirect("https://yuwn8.csb.app/success");
//     const { filename, title, description } = JSON.parse(req.query.state);
//     OAuth.getToken(req.query.code, (err, tokens) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         OAuth.setCredentials(tokens);
//         youtube.video.insert(
//             {
//                 resource: {},
//                 part: 'snippet,status',
//                 media: {
//                     body: fs.createReadStream(filename)
//                 },
//                 snippet: {
//                     title,
//                     description
//                 },
//                 status: {
//                     privacyStatus: 'public'
//                 }
//             },
//             (err, data) => {
//                 console.log("Done");
//                 process.exit();
//             }
//         );
//     });
// });

// const OAuth = youtube.authenticate({ 
//     type: 'oauth',
//     client_id: credential.web.client_id,
//     client_secret: credential.web.client_secret, 
//     redirect_url: credential.web.redirect_uris[0]
// });

// app.listen(PORT, (req, res) => {
//     console.log(`App is listening on Port ${PORT}`);
// });





// const express = require("express");
// const { google } = require("googleapis");
// const { v4: uuid } = require("uuid");
// const cors = require("cors");
// const multer = require("multer");
// const open = require("open");
// const fs = require('fs');
// const credential = require('./credentials.json');

// const PORT = 3000;

// const app = express();
// app.use(express.json());
// app.use(cors());

// const storage = multer.diskStorage({
//     destination: './',
//     filename (req, file, cb) {
//         const newFileName = `${uuid()}-${file.originalname}`;
//         cb(null, newFileName);
//     }
// });

// const uploadVideoFile = multer({
//     storage: storage
// }).single("videoFile");

// const OAuth2 = google.auth.OAuth2;
// const oauth2Client = new OAuth2(
//     credential.web.client_id,
//     credential.web.client_secret,
//     credential.web.redirect_uris[0]
// );

// const youtube = google.youtube({
//     version: 'v3',
//     auth: oauth2Client
// });

// app.post('/upload', uploadVideoFile, (req, res) => {
//     if (req.file) {
//         const filename = req.file.filename;
//         const { title, description } = req.body;

//         const authUrl = oauth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: 'https://www.googleapis.com/auth/youtube.upload',
//             state: JSON.stringify({
//                 filename,
//                 title,
//                 description
//             })
//         });

//         open(authUrl).then(() => {
//             res.send("Authentication required. Please authorize the app.");
//         }).catch(err => {
//             console.error("Error opening the auth URL:", err);
//             res.status(500).send("Error opening the auth URL.");
//         });
//     } else {
//         res.status(400).send("No video file uploaded.");
//     }
// });

// app.get('/oauth2callback', (req, res) => {
//     res.redirect("https://yuwn8.csb.app/success");
//     const { filename, title, description } = JSON.parse(req.query.state);

//     oauth2Client.getToken(req.query.code, (err, tokens) => {
//         if (err) {
//             console.error("Error getting OAuth tokens:", err);
//             return res.status(500).send("Error getting OAuth tokens.");
//         }
//         oauth2Client.setCredentials(tokens);

//         youtube.videos.insert({
//             resource: {
//                 snippet: {
//                     title: title,
//                     description: description
//                 },
//                 status: {
//                     privacyStatus: 'public'
//                 }
//             },
//             part: 'snippet,status',
//             media: {
//                 body: fs.createReadStream(filename)
//             }
//         }, (err, data) => {
//             if (err) {
//                 console.error("Error uploading video:", err);
//                 return res.status(500).send("Error uploading video.");
//             }
//             console.log("Video uploaded successfully:", data);
//             res.send("Video uploaded successfully.");
//         });
//     });
// });

// app.listen(PORT, () => {
//     console.log(`App is listening on Port ${PORT}`);
// });


// const express = require("express");
// const { google } = require("googleapis");
// const { v4: uuid } = require("uuid");
// const cors = require("cors");
// const multer = require("multer");
// const open = require("open");
// const { Readable } = require("stream");  // Import the Readable class from the stream module


// require('dotenv').config();

// const PORT = 3000;

// const app = express();
// app.use(express.json());
// app.use(cors());

// const storage = multer.memoryStorage();

// const uploadVideoFile = multer({
//     storage: storage
// }).single("videoFile");

// const OAuth2 = google.auth.OAuth2;
// const oauth2Client = new OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URIS
// );

// const youtube = google.youtube({
//     version: 'v3',
//     auth: oauth2Client
// });

// // In-memory storage for video files
// const videoBufferStore = {};

// app.post('/upload', uploadVideoFile, (req, res) => {
//     if (req.file) {
//         const { title, description } = req.body;
//         const fileBuffer = req.file.buffer;
//         const fileId = uuid();

//         // Store the buffer in memory
//         videoBufferStore[fileId] = {
//             buffer: fileBuffer,
//             title,
//             description
//         };

//         const authUrl = oauth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: 'https://www.googleapis.com/auth/youtube.upload',
//             state: JSON.stringify({ fileId })
//         });

//         open(authUrl).then(() => {
//             res.send("Authentication required. Please authorize the app.");
//         }).catch(err => {
//             console.error("Error opening the auth URL:", err);
//             res.status(500).send("Error opening the auth URL.");
//         });
//     } else {
//         res.status(400).send("No video file uploaded.");
//     }
// });

// app.get('/oauth2callback', (req, res) => {
//     res.redirect("https://yuwn8.csb.app/success");
//     const { fileId } = JSON.parse(req.query.state);
//     const videoData = videoBufferStore[fileId];

//     if (!videoData) {
//         return res.status(400).send("Invalid file ID.");
//     }

//     const { buffer, title, description } = videoData;

//     oauth2Client.getToken(req.query.code, (err, tokens) => {
//         if (err) {
//             console.error("Error getting OAuth tokens:", err);
//             return res.status(500).send("Error getting OAuth tokens.");
//         }
//         oauth2Client.setCredentials(tokens);

//         youtube.videos.insert({
//             resource: {
//                 snippet: {
//                     title: title,
//                     description: description
//                 },
//                 status: {
//                     privacyStatus: 'public'
//                 }
//             },
//             part: 'snippet,status',
//             media: {
//                 body: Readable.from(buffer)  // Use a readable stream from the buffer
//             }
//         }, (err, data) => {
//             if (err) {
//                 console.error("Error uploading video:", err);
//                 return res.status(500).send("Error uploading video.");
//             }
//             console.log("Video uploaded successfully:", data);
//             res.send("Video uploaded successfully.");
//         });
//     });
// });

// app.listen(PORT, () => {
//     console.log(`App is listening on Port ${PORT}`);
// });



// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// // const express = require("express");
// const { google } = require("googleapis");
// const { v4: uuid } = require("uuid");
// // const cors = require("cors");
// const multer = require("multer");
// const open = require("open");
// const { Readable } = require("stream");  // Import the Readable class from the stream module
// const cors = require('cors');

// // require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware to parse incoming JSON requests
// app.use(express.json());
// app.use(cors());

// const storage = multer.memoryStorage();

// const uploadVideoFile = multer({
//     storage: storage
// }).single("videoFile");

// const OAuth2 = google.auth.OAuth2;
// const oauth2Client = new OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URIS
// );

// const youtube = google.youtube({
//     version: 'v3',
//     auth: oauth2Client
// });

// // In-memory storage for video files
// const videoBufferStore = {};

// app.post('/upload', uploadVideoFile, (req, res) => {
//     if (req.file) {
//         const { title, description } = req.body;
//         const fileBuffer = req.file.buffer;
//         const fileId = uuid();

//         // Store the buffer in memory
//         videoBufferStore[fileId] = {
//             buffer: fileBuffer,
//             title,
//             description
//         };

//         const authUrl = oauth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: 'https://www.googleapis.com/auth/youtube.upload',
//             state: JSON.stringify({ fileId })
//         });

//         open(authUrl).then(() => {
//             res.send("Authentication required. Please authorize the app.");
//         }).catch(err => {
//             console.error("Error opening the auth URL:", err);
//             res.status(500).send("Error opening the auth URL.");
//         });
//     } else {
//         res.status(400).send("No video file uploaded.");
//     }
// });

// app.get('/oauth2callback', (req, res) => {
//     res.redirect("https://yuwn8.csb.app/success");
//     const { fileId } = JSON.parse(req.query.state);
//     const videoData = videoBufferStore[fileId];

//     if (!videoData) {
//         return res.status(400).send("Invalid file ID.");
//     }

//     const { buffer, title, description } = videoData;

//     oauth2Client.getToken(req.query.code, (err, tokens) => {
//         if (err) {
//             console.error("Error getting OAuth tokens:", err);
//             return res.status(500).send("Error getting OAuth tokens.");
//         }
//         oauth2Client.setCredentials(tokens);

//         youtube.videos.insert({
//             resource: {
//                 snippet: {
//                     title: title,
//                     description: description
//                 },
//                 status: {
//                     privacyStatus: 'public'
//                 }
//             },
//             part: 'snippet,status',
//             media: {
//                 body: Readable.from(buffer)  // Use a readable stream from the buffer
//             }
//         }, (err, data) => {
//             if (err) {
//                 console.error("Error uploading video:", err);
//                 return res.status(500).send("Error uploading video.");
//             }
//             console.log("Video uploaded successfully:", data);
//             res.send("Video uploaded successfully.");
//         });
//     });
// });


// app.get('/hell',(req,res)=>{
//   res.send('<h1>Form submitted successfully! Response may take 1-2 business days.</h1>');
// })
// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const multer = require("multer");
const { Readable } = require("stream");
// require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const uploadVideoFile = multer({ storage: storage }).single("videoFile");

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS
);

const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
});

// In-memory storage for video files
const videoBufferStore = {};

app.post('/upload', uploadVideoFile, (req, res) => {
    if (req.file) {
        const { title, description } = req.body;
        const fileBuffer = req.file.buffer;
        const fileId = uuid();

        // Store the buffer in memory
        videoBufferStore[fileId] = {
            buffer: fileBuffer,
            title,
            description
        };

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/youtube.upload',
            state: JSON.stringify({ fileId })
        });

        res.json({ authUrl, message: "Please navigate to the URL to authorize the app." });
    } else {
        res.status(400).send("No video file uploaded.");
    }
});

app.get('/oauth2callback', (req, res) => {
    const { fileId } = JSON.parse(req.query.state);
    const videoData = videoBufferStore[fileId];

    if (!videoData) {
        return res.status(400).send("Invalid file ID.");
    }

    const { buffer, title, description } = videoData;

    oauth2Client.getToken(req.query.code, (err, tokens) => {
        if (err) {
            console.error("Error getting OAuth tokens:", err);
            return res.status(500).send("Error getting OAuth tokens.");
        }
        oauth2Client.setCredentials(tokens);

        youtube.videos.insert({
            resource: {
                snippet: {
                    title: title,
                    description: description
                },
                status: {
                    privacyStatus: 'public'
                }
            },
            part: 'snippet,status',
            media: {
                body: Readable.from(buffer)  // Use a readable stream from the buffer
            }
        }, (err, data) => {
            if (err) {
                console.error("Error uploading video:", err);
                return res.status(500).send("Error uploading video.");
            }
            console.log("Video uploaded successfully:", data);
            res.send("Video uploaded successfully.");
        });
    });

    res.redirect("https://tube-x.vercel.app/hell");
});

app.get('/hell', (req, res) => {
    res.send('<h1>Form submitted successfully! Response may take 1-2 business days.</h1>');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
