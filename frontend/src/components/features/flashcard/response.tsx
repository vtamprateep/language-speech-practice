import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function TypedResponse({ callback, resetSignal }: {
    callback?: (userInput: string) => void,
    resetSignal?: unknown,
}) {
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue("");
    }, [resetSignal]);

    return (
        <div className="flex flex-col items-center gap-2">
            <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && callback) {
                        callback(value.trim());
                    }
                }}
                placeholder="Type the character"
            />
            <Button onClick={() => {
                callback ? callback(value.trim()) : null
            }}>
                Check Answer
            </Button>
        </div>
    );
}


export function MultipleChoiceResponse({
    choices,
    callback
}: {
    choices: string[],
    callback?: (userInput: string) => void
}) {
    return (
        <div className="flex flex-col gap-2 w-72">
            {choices.map((choice) => (
                <Button
                    key={choice}
                    onClick={() => {
                        callback ? callback(choice) : null
                    }}
                >
                    {choice}
                </Button>
            ))}
        </div>
    );
}
