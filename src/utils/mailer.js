import nodemailer from 'nodemailer';

export async function sendMail(userEmail, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cnsender2@gmail.com',
      pass: 'qrqulwdosrfoimld'
    }
  });

  const mailOptions = {
    from: 'cnsender2@gmail.com',
    to: userEmail,
    subject: 'OTP for resetting the password',
    text: 'The OTP is ' + otp
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (err) {
    console.log('Email send failed: ' + err);
  }
}
