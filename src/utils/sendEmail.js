

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
        subject: 'Novo Lead',
        text: `
          <h1>Nome: ${data.name}</h1>
          <h1>Telefone: ${data.phone}</h1>
          <h1>Email: ${data.email}</h1>
          <h1>Empresa: ${data.company}</h1>
          <h1>Descrição: ${data.description}</h1>
        `
      };

      try
        {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.log('Error sending email', error);
        }
}

module.exports = sendEmail;