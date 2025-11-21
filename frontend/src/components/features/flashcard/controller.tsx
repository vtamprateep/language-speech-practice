import { Vocabulary } from "@/lib/backend";
import { useState, useEffect } from "react";


type Mode = "typing" | "multiple-choice";

export function useFlashcardController(vocabulary: Vocabulary[]) {
    const [index, setIndex] = useState(0);
    const [mode, setMode] = useState<Mode>("typing");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const currentVocabulary = vocabulary[index];

    const next = () =>
        setIndex((prev) => Math.min(prev + 1, vocabulary.length - 1));

    const prev = () =>
        setIndex((prev) => Math.max(prev - 1, 0));

    const checkResponse = (answer: string) => {
        const expected =
            mode === "typing" ? currentVocabulary.traditional : currentVocabulary.english;

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
                .filter((v) => v.id !== currentVocabulary.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map((v) => v.english);

            const opts = [...wrongAnswers, currentVocabulary.english].sort(
                () => 0.5 - Math.random()
            );

            setChoices(opts);
        }
    }, [index]);

    return {
        currentVocabulary,
        mode,
        isCorrect,
        choices,
        next,
        prev,
        checkResponse,
    };
}