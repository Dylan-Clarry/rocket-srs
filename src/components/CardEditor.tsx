import { useState } from "react";
import { api, RouterOutputs } from "../utils/api";
import MarkdownEditorAndRenderer from "./MarkdownEditorAndRenderer";

type Card = RouterOutputs["card"]["getSchema"];

const blankCardTemplate = "\n".repeat(3) + "---back---" + "\n".repeat(3);

export default function CardEditor({ card }: { card: Card }) {
    if (!card) {
        return null;
    }
    const [mainDoc, setMainDoc] = useState<string>(card.content);
    const [keybinding, setKeybinding] = useState<string>("standard");

    const ctx = api.useContext();
    const { mutate: editCard, isLoading: isEditingCards } = api.card.editContent.useMutation({
        onSuccess: () => {
            ctx.card.getAll.invalidate();
        },
    });

    const { mutate: deleteCard, isLoading: isDeletingCard } = api.card.delete.useMutation({
        onSuccess: () => {
            ctx.card.invalidate();
        },
    });

    const handleDeleteCard = () => {
        deleteCard({
            id: card.id,
        });
    };

    const handleEditCard = () => {
        editCard({
            id: card.id,
            content: mainDoc,
        });
    };

    return (
        <div className="h-full">
            <div className="flex flex-col px-4">
                <div className="c-top-bar pt-2">
                    <div className="flex justify-between">
                        <div></div>
                        <div>
                            <select
                                className="rounded-md bg-neutral-800 p-1"
                                onChange={(e) => setKeybinding(e.target.value)}
                                defaultValue="standard"
                                name="keybinding"
                                id="keybinding"
                            >
                                <option value="standard">Standard</option>
                                <option value="vim">Vim</option>
                                <option value="emacs">Emacs</option>
                            </select>
                        </div>
                    </div>
                </div>
                <MarkdownEditorAndRenderer
                    keybinding={keybinding}
                    mainDoc={mainDoc}
                    setMainDoc={setMainDoc}
                />
                <div className="c-bot-bar flex justify-end">
                    <button
                        onClick={handleDeleteCard}
                        disabled={isDeletingCard}
                        className="mt-3.5 mb-4 rounded-md bg-red-600 p-1 text-sm hover:bg-red-500"
                    >
                        Delete Card
                    </button>
                    <button
                        disabled={isEditingCards}
                        onClick={handleEditCard}
                        className="mt-3.5 mb-4 rounded-md bg-green-600 p-1 text-sm hover:bg-green-500"
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
