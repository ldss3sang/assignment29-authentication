import Button from "@/components/button";
import db from "@/utils/db";
import getSession from "@/utils/session"
import { notFound, redirect } from "next/navigation";

const getUser = async () => {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: { id: session.id }
        });

        if (user) {
            return user;
        }
    }

    notFound();
}
export default async function Home() {
    const user = await getUser();
    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy();
        redirect("/");
    }

    return (
        <div className="flex flex-col gap-10 items-center justify-center">
            <h1 className="text-5xl">Welcome! {user?.username}!</h1>
            <form className="w-full" action={logOut}>
                <Button text="Log out" />
            </form>
        </div>
    );
}