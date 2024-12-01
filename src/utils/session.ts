import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

const getSession = async () => {
  const session = await getIronSession<SessionContent>(cookies(), {
    cookieName: "authentication",
    password: process.env.COOKIE_PASSWORD!,
  });
  return session;
};

export default getSession;