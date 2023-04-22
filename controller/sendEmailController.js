// const User = require("../model/User");
// const nodemailer = require("nodemailer");
// const sendinBlueTransport = require("nodemailer-sendinblue-transport");

// const sendSingleEmail = async (req, res) => {
//   const { reciver, subject, text, title } = req.body;

//   const transporter = nodemailer.createTransport({
//     service: "SendinBlue",
//     auth: {
//       user: "amineamroussi1@gmail.com",
//       pass: process.env.EMAIL_API,
//     },
//   });

//   const testAcount = await nodemailer.createTestAccount();

//   const htmlContext = `
//   <div>
//   <h1>${title}</h1>
//   <p>${text}</p>
//   </div>`;
//   const mailOptions = {
//     from: "amineamroussi1@gmail.com",
//     to: reciver,
//     subject: subject,
//     html: htmlContext,
//   };

//   const response = await transporter.sendMail(mailOptions);

//   res.status(200).json({ email: response });
// };

// const sendEmailForAllUsers = async (req, res) => {
  
//   const { reciver, subject, text, title } = req.body;

//   const allUsers = await User.find().select("email");
//   const transporter = nodemailer.createTransport({
//     service: "SendinBlue",
//     auth: {
//       user: "amineamroussi1@gmail.com",
//       pass: process.env.EMAIL_API,
//     },
//   });

//   allUsers.forEach(async (email) => {

//     const htmlContext = `
//     <div>
//     <h1>${title}</h1>
//     <p>${text}</p>
//     </div>`;
//     const mailOptions = {
//       from: "amineamroussi1@gmail.com",
//       to: email,
//       subject: subject,
//       html: htmlContext,
//     };
  
//     const response = await transporter.sendMail(mailOptions);
    
//   });

//   res.status(200).json({msg : `all emails was sended`})
// };

// module.exports = { sendEmailForAllUsers, sendSingleEmail };
