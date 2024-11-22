import twilio from 'twilio';

export const sentTwilioSms = async (to: string, message: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  
  const client = twilio(accountSid, authToken);
  const response = await client.messages.create({
      body: message,
      from: from ,
      to: "+63" + to
  });
console.log('Message sent:', response.sid);
}