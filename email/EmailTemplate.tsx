interface EmailTemplateProps {
    username: string,
    otp:string
  }
  
  export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    username,otp
  }) => (
    <div className="flex flex-col gap-2 justify-center items-start">
      <h1 className="text-3xl">Welcome, <span className="text-orange-600 font-light text-3xl"> {username}</span>!</h1>
      <h2 className="font-bold">Your Code: {otp}</h2>
    </div>
  );