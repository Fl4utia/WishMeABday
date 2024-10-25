"use client";

function Page() {
  const handleClick = async () => {
    const firstName = "Juan"; // El nombre que quieres pasar
    const link = "https://example.com/birthday-card"; // El enlace que quieres pasar

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          link
        }),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div>
      <button className="bg-slate-500" onClick={handleClick}>
        Send Email
      </button>
    </div>
  );
}

export default Page;
