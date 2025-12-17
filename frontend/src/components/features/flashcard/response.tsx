import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function TypedResponse({ disabled, callback }: {
    disabled?: boolean,
    callback?: (userInput: string) => void,
}) {
    const [value, setValue] = useState("");

    return (
        <div className="flex flex-col items-center gap-2">
            <Input
                type="text"
                value={value}
                disabled={disabled}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && callback) {
                        callback(value.trim());
                        setValue("");
                    }
                }}
                placeholder="Type the character"
            />
            <Button 
                disabled={disabled}
                onClick={() => {
                    callback ? callback(value.trim()) : null
                    setValue("");
                }}
            >
                Check Answer
            </Button>
        </div>
    );
}


export function MultipleChoiceResponse({
    choices,
    disabled,
    callback
}: {
    choices: Record<number, string>,
    disabled?: boolean,
    callback?: (userInput: string) => void
}) {
    return (
        <div className="flex flex-col gap-2 w-72">
            {
                Object.entries(choices).map(([key, value]) => (
                    <Button
                        key={key}
                        disabled={disabled}
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
