import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { api, RouterOutputs } from "../../utils/api";
import { useEffect } from "react";

type Deck = NonNullable<RouterOutputs["deck"]["getAll"][number]>;

export default function AltLayout({ children }: any) {
    const { data: session, status } = useSession();
    const deckList = api.deck.getAll.useQuery().data as Deck[];
    const name = session?.user.name || "";
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.replace("/");
        }
    }, [router, session]);

    if (status === "loading") {
        return <main className="mt-4 flex flex-col items-center">loading...</main>;
    }

    if (!deckList) {
        return <main className="mt-4 flex flex-col items-center">Error fetching decklist</main>;
    }

    return (
        <main className="px-8">
            <div className="w-full px-4">
                <TopBar name={name} />
            </div>
            <div className="flex-1">{children}</div>
        </main>
    );
}

function TopBar({ name }: { name: string }) {
    return (
        <div className="mt-2 flex w-full items-center justify-between">
            <span className="flex items-center">
                <span className="mr-2 text-xl">
                    <Link href="/">🚀</Link>
                </span>
                <p>{name}</p>
            </span>
            <ul className="flex gap-4">
                <Link href="/decks">
                    <li>Decks</li>
                </Link>
                <Link href="/create">
                    <li>Create</li>
                </Link>
                <Link href="/manage">
                    <li>Manage</li>
                </Link>
            </ul>
            <button
                type="button"
                className="block rounded-md bg-neutral-800 px-2 pt-0.5 pb-1 hover:bg-neutral-700"
                onClick={() => {
                    signOut().catch(console.log);
                }}
            >
                Sign Out
            </button>
        </div>
    );
}

function UsernameAndSignOut({ name }: { name: string }) {
    return (
        <div className="mt-2 flex w-full items-center justify-between">
            <span className="flex items-center">
                <span className="mr-2 text-xl">
                    <Link href="/">🚀</Link>
                </span>
                <p>{name}</p>
            </span>
            <button
                type="button"
                className="block rounded-md bg-neutral-800 px-2 pt-0.5 pb-1 hover:bg-neutral-700"
                onClick={() => {
                    signOut().catch(console.log);
                }}
            >
                Sign Out
            </button>
        </div>
    );
}
