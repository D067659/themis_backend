const nodemailer = require('nodemailer');
const path = require('path');

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
    attachments: [{
      filename: 'sports.png',
      path: path.join(__dirname, '../') + 'images/sports.png',
      cid: 'sportIMG'
    },
    {
      filename: 'website.png',
      path: path.join(__dirname, '../') + 'images/website.png',
      cid: 'websiteIMG'
    },
    {
      filename: 'email.png',
      path: path.join(__dirname, '../') + 'images/email.png',
      cid: 'emailIMG'
    }],
    html: `
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Themis</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

</html>

<body style="margin: 0; padding: 0;">

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc;">
        <tr>
            <td align="center" bgcolor="#70bbd9" style="padding: 20px 0 30px 0;">
                <img src="cid:sportIMG" alt="Creating Email Magic" width="250" height="200" style="display: block;" />
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                            <b>
                                Bestätige jetzt deine Registrierung!
                            </b>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                            <p>Hallo ${receiverName}, willkommen bei Themis!</p>
                            <p>Du hast soeben eine Einladung in den Verein ${senderClubName} von ${senderName} erhalten.
                                Bitte bestätige, dass du dem Verein beitreten möchtest, indem du auf den folgenden Link
                                klickst:</p>

                            <p> <a
                                    href=${process.env.URL_HOST_FRONTEND}/register?club=${senderClubId}&confirmationCode=${confirmationCode}&email=${receiverEmail}>Jetzt
                                    bestätigen</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                            &reg; Themis Sports, privat & demo version 2022<br />
                        </td>
                        <td align="right">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <a href="mailto:vereinmanagement@gmail.com">
                                            <img src="cid:emailIMG" alt="E-Mail" width="38" height="38"
                                                style="display: block;" border="0" />
                                        </a>
                                    </td>
                                    <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                    <td>
                                        <a href=${process.env.URL_HOST_FRONTEND}>
                                            <img src="cid:websiteIMG" alt="Website" width="38" height="38"
                                                style="display: block;" border="0" />
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
`,
  }).catch((err) => console.log(err));
};
