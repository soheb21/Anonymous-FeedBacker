interface EmailTemplateProps {
    username: string,
    otp:string
  }
  
  export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    username,otp
  }) => (
    <div>
      <h1 >Welcome, {username}!</h1>
      <h2 className="font-bold">Your Code: {otp}</h2>
    </div>
  );