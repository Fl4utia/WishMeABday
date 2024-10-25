interface EmailTemplateProps {
  firstName: string;
  link: string;
}

export function EmailTemplate({ firstName, link }: EmailTemplateProps) {
  return (
    <div>
      <h1>Happy Birthday, {firstName}!</h1>
      <p>A very special someone let us know it's your birthday! We hope your day is absolutely fantastic. Here is a special card created just for you:</p>
      <a href={link}>View Your Birthday Card</a>
    </div>
  );
}
