import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function TypedResponse({ callback }: {
    callback?: (userInput: string) => void,
}) {
    const [value, setValue] = useState("");

    return (
        <div className="flex flex-col items-center gap-2">
            <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && callback) {
                        callback(value.trim());
                        setValue("");
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
    choices: Record<number, string>,
    callback?: (userInput: string) => void
}) {
    return (
        <div className="flex flex-col gap-2 w-72">
            {
                Object.entries(choices).map(([key, value]) => (
                    <Button
                        key={key}
                        onClick={() => {
                            callback ? callback(value) : null
                        }}
                    >
                        {value}
                    </Button>
                ))
            }
        </div>
    );
}
