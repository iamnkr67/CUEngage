const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT;
const db = require("./config/dbConnect");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const contest = require("./routes/contest");
app.use("/contestant", contest);

const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);

const pendingData = require("./routes/pending");
app.use("/pending", pendingData);

const eventRoutes = require("./routes/event");
app.use("/event", eventRoutes);

const upload = require("./middleware/fileUpload");

const Seat = require("./model/pendingSchema");

cron.schedule("*/10 * * * *", async () => {
  try {
    console.log("Checking for approved seats...");
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const approvedUsers = await Seat.find({
      status: "approved",
      emailSent: false,
    });

    for (const user of approvedUsers) {
      const { name, rollNo, semester, seat, email, _id } = user;

      try {
        const uniqueId = _id.toString();

        const qrData = JSON.stringify({
          name,
          rollNo,
          semester,
          seat,
          uniqueId,
        });
        const qrCodePath = `./temp/qrcode-${uniqueId}.png`;
        await QRCode.toFile(qrCodePath, qrData);

        const idCardHtml = `
          <style>
            body { background-color: transparent; font-family:'verdana'; }
            .id-card-holder { width: 225px; padding: 4px; margin: 0 auto; background-color: #1f1f1f; border-radius: 5px; position: relative; }
            .id-card-holder:after, .id-card-holder:before { content: ''; width: 7px; display: block; background-color: #0a0a0a; height: 100px; position: absolute; top: 105px; border-radius: 0 5px 5px 0; }
            .id-card { background-color: #fff; padding: 10px; border-radius: 10px; text-align: center; box-shadow: 0 0 1.5px 0px #b9b9b9; }
            .header img { width: 100px; margin-top: 15px; }
            h2, h3 { font-size: 15px; margin: 5px 0; }
            .idSS { text-align: justify; margin: 5px 20px; color : rgb(158, 79, 14) }
            .photo img { width: 80px; margin-top: 15px; }
            .qr-code img { width: 50px; }
            .id-card-hook { background-color: black; width: 70px; margin: 0 auto; height: 15px; border-radius: 5px 5px 0 0; }
            .id-card-tag-strip { width: 45px; height: 40px; background-color: #d9300f; margin: 0 auto; border-radius: 5px; position: relative; top: 9px; z-index: 1; border: 1px solid #a11a00; }
          </style>

          <div class="id-card-tag"></div>
          <div class="id-card-tag-strip"></div>
          <div class="id-card-hook"></div>
          <div class="id-card-holder">
            <div class="id-card">
              <h4 style="background: linear-gradient(to right, #f97316, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Freshers 2024 <br/> Entry Card</h3>
              <div class="header">
                <img src="data:image/png;base64,${fs.readFileSync(qrCodePath, {
                  encoding: "base64",
                })}" alt="QR Code" style="width: 35mm; height: 35mm; margin-bottom: 5px;" >
              </div>
              <h3 style="background: linear-gradient(to right, #f97316, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; size: 20px;">${uniqueId}</h3>
              <h2>${name}</h2>
              <h3 class="idSS">Semester : ${semester}</h3>
              <h3 class="idSS">Roll Code : ${rollNo}</h3>
              <h3 class="idSS">Seat No. ${seat}</h3>
              <hr>
              <p><strong>Nalanda College</strong> Kisan College Road, Bihar Sharif, Nalanda, Bihar</p>
              <p>District Nalanda, Bihar <strong>803101</strong></p>
            </div>
          </div>
        `;

        const browser = await puppeteer.launch({
          executablePath:
            "C:/Program Files/Google/Chrome/Application/chrome.exe",
          headless: true,
        });
        const page = await browser.newPage();
        const widthInPx = Math.round(80 * 3.77953);
        const heightInPx = Math.round(48 * 3.77953);

        await page.setViewport({ width: widthInPx, height: heightInPx });
        await page.setContent(idCardHtml, { waitUntil: "domcontentloaded" });

        const pdfPath = `./temp/idcard-${uniqueId}.pdf`;
        await page.pdf({
          path: pdfPath,
          printBackground: true,
          format: "A4",
          width: `${widthInPx}px`,
          height: `${heightInPx}px`,
          pageRanges: "1",
        });
        await browser.close();

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Freshers" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "🎉 Welcome to the Freshers and Farewell Celebration! 🎓",
          html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <p>Dear <strong>${name}</strong>,</p>
              <p>🎊 You are warmly invited to the <strong>Freshers and Farewell Celebration 2024</strong> hosted by the Department of English, Nalanda College. 🎉</p>
              <p>✨ <strong>Your seat is confirmed!</strong> 🎟️ <strong>Seat No:</strong> ${seat} 🪪 <strong>Unique ID: </strong> ${uniqueId} </p>
              <p>📅 <strong>Mark Your Calendar</strong>: 🗓️ Date: Soon to be announced...</p>
              <p>📍 Venue: Auditorium, Nalanda College</p>
              <p>See you there!</p>
              <p>Best regards, <strong>Team Nalanda College || Freshers</strong></p>
              <p>✨ Together, let’s make unforgettable memories! ✨</p>
            </div>
          `,
          attachments: [
            { filename: `${name}-ID-Card-${uniqueId}.pdf`, path: pdfPath },
          ],
        });

        await Seat.findByIdAndUpdate(user._id, { emailSent: true });
        fs.unlinkSync(qrCodePath);
        fs.unlinkSync(pdfPath);

        console.log(`Email sent to ${email}`);
      } catch (err) {
        console.error(`Error processing user ${email}:`, err);
      }
    }
  } catch (err) {
    console.error("Error checking for approved seats:", err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
