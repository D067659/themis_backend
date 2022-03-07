const nodemailer = require('nodemailer');

const user = process.env.MAIL_SENDER_ID;
const pass = process.env.MAIL_SENDER_PW;

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user,
    pass,
  },
});

module.exports.sendConfirmationEmail = (senderName, senderClubId, senderClubName, receiverName, receiverEmail, confirmationCode) => {
  transport.sendMail({
    from: user,
    to: receiverEmail,
    subject: `Themis: Deine Einladung zu ${senderClubName}`,
    html: `<h1>Bitte bestätige deine Registrierung</h1>
          <h2>Hallo ${receiverName}</h2>
          <p>du hast soeben eine Einaldung in den Verein ${senderClubName} von ${senderName} erhalten. Bitte bestätige, dass du dem Verein beitreten möchtest, indem du auf den folgenden Link klickst:</p>
          <a href=${process.env.URL_HOST_FRONTEND}/register?club=${senderClubId}&confirmationCode=${confirmationCode}&email=${receiverEmail}> Jetzt bestätigen</a>
          </div>`,
  }).catch((err) => console.log(err));
};
