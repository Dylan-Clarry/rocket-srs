import { api } from "../utils/api";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface IDeck {
    id: string,
    name: string
}

export default function DeckList(props: {data: any}) {
    const { data: deckList, isLoading } = props.data;

    if (isLoading) {
        return <div className="mt-3 flex flex-col gap-4 text-center">Fetching decks...</div>;
    }

    return (
        <div className="mt-3 flex flex-col gap-4">
            <ul>
                {deckList?.map((deck: IDeck, idx: number) => {
                    return (
                        <CollapsableList deck={deck} idx={idx}/>
                    );
                })}
            </ul>
        </div>
    );
}

function CollapsableList(props: {deck: any, idx: number}) {
    const { deck, idx } = props;
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const handleCollapse = () => {
        setIsCollapsed((isCollapsed) => !isCollapsed);
    };
    const utils = api.useContext();
    const deleteDeck = api.deck.deleteDeck.useMutation({
        onSettled: async () => {
            await utils.deck.invalidate();
        },
    });

    return (
        <li key={idx} className="mb-2">
            <p className="mr-2" onClick={handleCollapse}> {deck.name} <FontAwesomeIcon icon={isCollapsed ? faChevronUp : faChevronDown}/></p>
            <ul
                className="ml-4 border-l border-neutral-800 pl-2"
                style={{ display: isCollapsed ? "block" : "none" }}
            >
                <li className="mt-1 rounded-md px-2 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">Review</li>
                <li className="mt-1 rounded-md px-2 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">Create</li>
                <li className="mt-1 rounded-md px-2 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">Manage</li>
                <li className="mt-1 rounded-md px-2 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">
                    <button
                        className="hover:cursor-pointer"
                        onClick={() => {
                            deleteDeck.mutate({
                                id: deck.id,
                                name: deck.name,
                            });
                        }}
                    >
                        Delete
                    </button>
                </li>
            </ul>
        </li>
    );
}
