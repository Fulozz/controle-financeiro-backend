

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  secure: true,
  port: 465,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});


const sendEmail = async (data) => {
    const mailOptions = {
        from: "onboarding@resend.dev",
        to: 'thiago.sandrade0720@gmail.com',
        subject: `Novo lead: ${data.name} - ${data.email}`,
        html: `
          <h1>Nome: ${data.name}</h1>
          <h4>Telefone: ${data.phone}</h4>
          <h4>Email de contato: ${data.email}</h4>
          <h4>Empresa: ${data.company}</h4>
          <h4>message: ${data.message}</h4>
        `
      };

      try
        {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log('Error sending email', error);
        }
}

module.exports = sendEmail;