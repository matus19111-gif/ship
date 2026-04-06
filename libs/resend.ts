// libs/resend.ts
import { Resend } from "resend";
import config from "@/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}) => {
  await resend.emails.send({
    from: config.resend.fromAdmin,
    to,
    subject,
    text,
    html,
    ...(replyTo && { replyTo }),
  });
};  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}): Promise<any> => {
  const data = {
    from: config.mailgun.fromAdmin,
    to: [to],
    subject,
    text,
    html,
    ...(replyTo && { "h:Reply-To": replyTo }),
  };

  await mg.messages.create(
    (config.mailgun.subdomain ? `${config.mailgun.subdomain}.` : "") +
      config.domainName,
    data
  );
};
