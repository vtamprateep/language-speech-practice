import { useState } from "react";
import { VocabularyItem } from "@/data/vocabulary";
import { Card, CardContent } from "@/components/ui/card";


export function VocabularyFlashcard({ item }: { item: VocabularyItem }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <Card
            className="relative w-64 h-40 cursor-pointer transition-transform duration-500"
            onClick={() => setFlipped(!flipped)}
        >
            {flipped ? (
                <CardContent className="absolute w-full h-full flex flex-col items-center justify-center backface-hidden p-4">
                    <p className="text-lg font-medium text-black">
                        {item.forms[0]?.transcriptions.pinyin}{" "}
                        <span className="text-gray-500">
                            ({item.forms[0]?.transcriptions.bopomofo})
                        </span>
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                        {item.forms[0]?.meanings.map((meaning, idx) => (
                            <li key={idx}>• {meaning}</li>
                        ))}
                    </ul>
                </CardContent>
            ) : (
                <CardContent className="absolute w-full h-full flex items-center justify-center backface-hidden">
                    <span className="text-4xl font-bold text-black">{item.simplified}</span>
                </CardContent>
            )}
        </Card>
    );
}
