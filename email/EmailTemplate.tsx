
interface EmailTemplateProps {
    username: string,
    otp:string
  }
  
  export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    username,otp
  }) => (
    <div>
      <h1>Welcome, {username}!</h1>
      <h1>Your Code: {otp}</h1>
    </div>
  );