import { useEffect, useState } from "react";
import { Vocabulary } from "@/lib/backend/types";
import { Card, CardContent } from "@/components/ui/card";


export function Flashcard({ item }: { item: Vocabulary }) {
    const [flipped, setFlipped] = useState(false);
    
    useEffect(() => {
        setFlipped(false);
    }, [item])

    return (
        <Card
            className="relative w-64 h-40 cursor-pointer transition-transform duration-500"
            onClick={() => setFlipped(!flipped)}
        >
            {flipped ? (
                <CardContent className="absolute w-full h-full flex flex-col items-center justify-center backface-hidden p-4">
                    <p className="text-lg font-medium text-black">
                        {item.pinyin}{" "}
                    </p>
                    <p className="mt-2 space-y-1 text-sm text-gray-700">
                        {item.english}
                    </p>
                </CardContent>
            ) : (
                <CardContent className="absolute w-full h-full flex items-center justify-center backface-hidden">
                    <span className="text-4xl font-bold text-black">{item.traditional}</span>
                </CardContent>
            )}
        </Card>
    );
}
