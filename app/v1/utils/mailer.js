import { createTransport } from "nodemailer";

export const transport = createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  //   how to get below values?
  // to get these values, you need to create an account on mailtrap.io
  // then create a new inbox and copy the values from there
  auth: {
    user: "95fdd858900bd6",
    pass: "584bc3ad9e76ce",
  },
});
