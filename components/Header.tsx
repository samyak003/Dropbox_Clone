import { SignInButton, SignedOut, UserButton, auth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";
import { Button } from "./ui/button";
import { GithubIcon } from "lucide-react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Badge } from "./ui/badge";

async function getData() {
    const { userId } = auth()
    const userDoc = await getDoc(doc(db, `users/${userId}`))
    const pro = userDoc.data()?.pro

    return pro
}

export default async function Header() {
    const pro = await getData()


    return (
        <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
                <div className="bg-[#0160FE] w-fit">
                    <Image src="https://www.shareicon.net/download/2016/07/13/606936_dropbox_2048x2048.png" alt="logo" className="invert"
                        height={50} width={50} />
                </div>
                <h1 className="font-bold text-xl">Dropbox</h1>
                {pro && <Badge variant={"default"}>Pro</Badge>}
            </Link>
            <div className="px-5 flex space-x-2 items-center">
                {!pro &&
                    <Button variant={"destructive"} asChild>
                        <Link href="/pro">
                            Buy More Storage
                        </Link>
                    </Button>
                }
                <Button size="icon" variant={"outline"} asChild>
                    <Link href="https://github.com/samyak003/Dropbox_Clone">
                        <GithubIcon className="h-4 w-4" />
                    </Link>

                </Button>

                <ThemeToggler pro={pro} />
                <UserButton afterSignOutUrl="/" />

                <SignedOut>
                    <SignInButton afterSignInUrl="/dashboard" mode="modal" />
                </SignedOut>
            </div>
        </header>
    )
}