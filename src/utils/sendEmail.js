

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


const sendEmail = async (mailOptions) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: 'seu_email@example.com',
        subject: 'Novo Lead',
        text: `
          Nome: ${data.name}
          Telefone: ${data.phone}
          Email: ${data.email}
          Empresa: ${data.company}
          Descrição: ${data.description}
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