import sgMail from '@sendgrid/mail';

async function sendMail(email: string, content: string, subject: string): Promise<void> {

7
  sgMail.setApiKey('api-key-sendgrid');
  const msg = {
    to: 'test@gmail.com', // Change to your recipient
    from: 'sendes@.mx', // Change to your verified sender
    subject: 'Birthday',
    //text: content,
    html: content,
  };
  sgMail
    .send(msg)
    .then(() => {
      //console.log(`Email ${content} sent to ${email} successfully.`);
    })
    .catch((error) => {
      console.error(`Email ${content} failed to be sent to ${email}. Error: ${error}`);
    });
}

export default sendMail;
