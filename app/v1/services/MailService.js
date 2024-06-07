export const setMailOptions = (otp, phoneNumber) => {
  return {
    from: '"Deerwalk Autoservices" <sahil.lodha0421@gmail.com>',
    to: "user1@example.com",
    subject: "OTP - Deerwalk Auto Services " + phoneNumber,
    html: `Hey there your OTP code is provided in this email message.<br/><b>OTP: </b>${otp}<br> <b>Registered Number: </b>${phoneNumber}`,
  };
};

export const setMailOptionsAdmin = (email, link, phoneNumber) => {
  return {
    from: '"Deerwalk Autoservices" <prasanshabharati@gmail.com>',
    to: `${email}`,
    subject: "Change Admin Password | Deerwalk Auto Services",
    html: `<p>Hello!<br> You requested to change your password in the application from the account corresponding to your registered number. You can do so by following the link below.<br> <b>Registered Number: ${phoneNumber}</b></p><br>${link}`,
  };
};
