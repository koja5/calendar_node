import dotenv from "dotenv";
import express from "express";
import { google } from "googleapis";
import moment from "moment";

dotenv.config({});

const calendar = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,
});

const app = express();

const PORT = process.env.NODE_ENV || 8000;

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = ["https://www.googleapis.com/auth/calendar"];
const token = "";

app.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  res.redirect(url);
});

app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  console.log(tokens);
  oauth2Client.setCredentials({
    refresh_token:
      "1//094-tXHwqcTq_CgYIARAAGAkSNwF-L9Ir95QFoFBJCFhTbZuzft4n_XzGBEmKJIKRp5GLp9e2m6uyWUbVRd6a7evbqtO4BljDmKA",
  });

  res.send({
    msg: "You have successfully logged in app!",
  });
});

app.get("/schedule_event", async (req, res) => {
  oauth2Client.setCredentials({
    refresh_token:
      "1//094-tXHwqcTq_CgYIARAAGAkSNwF-L9Ir95QFoFBJCFhTbZuzft4n_XzGBEmKJIKRp5GLp9e2m6uyWUbVRd6a7evbqtO4BljDmKA",
  });

  await calendar.events.insert({
    calendarId: "primary",
    auth: oauth2Client,
    requestBody: {
      summary: "Event for OfficeNode from NodeJs 2",
      description: "This is description for test event from NodeJS",
      start: {
        dateTime: moment(new Date()).add(1, "day").toISOString(),
        timeZone: "Europe/Belgrade",
      },
      end: {
        dateTime: moment(new Date()).add(1, "day").add(1, "day").toISOString(),
        timeZone: "Europe/Belgrade",
      },
    },
  });

  res.send("DONE");
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
