import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { firstName, link } = await req.json(); // Recibe el nombre y el enlace

    // Construye el contenido HTML del email
    const htmlContent = `
      <div>
        <h1>Happy Birthday, ${firstName}!</h1>
        <p>We hope you have a fantastic day! Here's a special card just for you:</p>
        <a href="${link}">View Your Birthday Card</a>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Happy birthday <onboarding@resend.dev>',
      to: ['ximenasaibot@gmail.com'],
      subject: `We heard it's your birthday, ${firstName}!`, // Personaliza el subject con el nombre
      html: htmlContent, // Pasa el contenido HTML directamente
    });

    console.log(data);
    return NextResponse.json(
      { message: 'Email Sent' },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error sending email' },
      { status: 500 }
    );
  }
}
