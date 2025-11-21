import { useEffect, useState } from "react";
import { Vocabulary } from "@/lib/backend";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


/*
    Flashcard UI Components
*/

function FlashcardControls({
    onNext,
    onPrev,
    disableNext,
    disablePrev,
}: {
    onNext: () => void;
    onPrev: () => void;
    disableNext?: boolean;
    disablePrev?: boolean;
}) {
    return (
        <div className="flex gap-4">
            <Button onClick={onPrev} disabled={disablePrev}>
                Back
            </Button>
            <Button onClick={onNext} disabled={disableNext}>
                Next
            </Button>
        </div>
    );
}


function TypingAnswer({ vocab, onCheck }: {
    vocab: Vocabulary,
    onCheck: (answer: string) => void
}) {
    const [value, setValue] = useState("");

    return (
        <div className="flex flex-col items-center gap-2">
            <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onCheck(value)}
                placeholder="Type the character"
            />
            <Button onClick={() => onCheck(value)}>Check Answer</Button>
        </div>
    );
}


function MultipleChoiceAnswer({
    choices,
    onCheck,
    isCorrect,
    correctValue,
}: {
    choices: string[];
    onCheck: (answer: string) => void;
    isCorrect: boolean | null;
    correctValue: string;
}) {
    return (
        <div className="flex flex-col gap-2 w-72">
            {choices.map((choice) => (
                <Button
                    key={choice}
                    onClick={() => onCheck(choice)}
                    disabled={isCorrect !== null}
                    className={
                        isCorrect !== null && choice === correctValue
                            ? "border-green-500 text-green-700"
                            : ""
                    }
                >
                    {choice}
                </Button>
            ))}
        </div>
    );
}


function Flashcard({ item }: { item: Vocabulary }) {
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


/*
    Standard vocabulary flashcard
*/

type Mode = "typing" | "multiple-choice";

export function VocabularyFlashcard({ vocabulary }: { vocabulary: Vocabulary[] }) {
    const {
        index,
        current,
        mode,
        choices,
        isCorrect,
        next,
        prev,
        check,
    } = useFlashcardController(vocabulary);

    return (
        <div className="flex flex-col items-center p-6 gap-6">
            <Flashcard item={current} />

            {mode === "typing" ? (
                <TypingAnswer vocab={current} onCheck={check} />
            ) : (
                <MultipleChoiceAnswer
                    choices={choices}
                    correctValue={current.english}
                    onCheck={check}
                    isCorrect={isCorrect}
                />
            )}

            {isCorrect !== null && (
                <p
                    className={`mt-2 font-medium ${
                        isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {isCorrect ? "Correct!" : "Incorrect"}
                </p>
            )}

            <FlashcardControls
                onNext={next}
                onPrev={prev}
                disablePrev={index === 0}
                disableNext={index === vocabulary.length - 1}
            />
        </div>
    );
}


export function useFlashcardController(vocabulary: Vocabulary[]) {
    const [index, setIndex] = useState(0);
    const [mode, setMode] = useState<Mode>("typing");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const current = vocabulary[index];

    const next = () =>
        setIndex((prev) => Math.min(prev + 1, vocabulary.length - 1));

    const prev = () =>
        setIndex((prev) => Math.max(prev - 1, 0));

    function check(answer: string) {
        const expected =
            mode === "typing" ? current.traditional : current.english;

        const correct = answer.trim() === expected;
        setIsCorrect(correct);
        return correct;
    }

    useEffect(() => {
        setIsCorrect(null);

        const random: Mode = Math.random() < 0.5 ? "typing" : "multiple-choice";
        setMode(random);

        if (random === "multiple-choice") {
            const wrongAnswers = vocabulary
                .filter((v) => v.id !== current.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map((v) => v.english);

            const opts = [...wrongAnswers, current.english].sort(
                () => 0.5 - Math.random()
            );

            setChoices(opts);
        }
    }, [index]);

    return {
        index,
        current,
        mode,
        isCorrect,
        choices,
        next,
        prev,
        check,
    };
}
