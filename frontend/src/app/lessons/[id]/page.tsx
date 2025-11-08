"use client";

import { useState, useEffect, use } from "react";

// Components
import { VocabularyFlashcard } from "@/components/features/flashcard";
import { GuidedDialogueText } from "@/components/features/dialogue";
import { GrammarDetail } from "@/components/features/grammar";

// Data imports
import { LessonModule, allLessons } from "@/data/lessons";
import { Vocabulary, allVocabulary } from "@/data/vocabulary";
import { GrammarRule, grammarRules } from "@/data/grammar";
import { DialogueTurn, allDialogue } from "@/data/dialogue";
import { Button } from "@/components/ui/button";


export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
    const lessonId = use(params);

    const [stepIndex, setStepIndex] = useState(0);
    const [lesson, setLesson] = useState<LessonModule | undefined>(
        allLessons.find((lesson) => lesson.id == lessonId.id)
    );

    const [vocabulary, setVocabulary] = useState<Vocabulary[]>();
    const [grammar, setGrammar] = useState<GrammarRule[]>();
    const [dialogue, setDialogue] = useState<DialogueTurn[]>();

    const steps = [
        vocabulary && vocabulary.length > 0
            ? {
                id: "vocabulary",
                label: "Vocabulary",
                content: <VocabularyFlashcard vocabulary={vocabulary} />,
            }
            : null,
        grammar && grammar.length > 0
            ? {
                id: "grammar",
                label: "Grammar",
                content: <GrammarBrowser grammarRules={grammar} />,
            }
            : null,
        dialogue && dialogue.length > 0
            ? {
                id: "dialogue",
                label: "Dialogue",
                content: <GuidedDialogueText dialogueSet={dialogue} />,
            }
            : null,
    ].filter(Boolean);

    const progress = ((stepIndex + 1) / steps.length) * 100;

    useEffect(() => {
        if (!lesson) return;

        // Resolve vocabulary
        const resolvedVocab = lesson.vocabularyId
            ? lesson.vocabularyId
                .map((vocabId) => allVocabulary.find((v) => v.id === vocabId))
                .filter((v): v is Vocabulary => Boolean(v))
            : [];

        // Resolve grammar rules
        const resolvedGrammar = lesson.grammarId
            ? lesson.grammarId
                .map((grammarRef) => grammarRules.find((g) => g.id === grammarRef))
                .filter((g): g is GrammarRule => Boolean(g))
            : [];

        // Resolve dialogue turns
        const resolvedDialogue = lesson.dialogueId ?
            allDialogue.find((obj) => obj.id == lesson.dialogueId) : undefined
        ;

        // Update state
        setVocabulary(resolvedVocab);
        setGrammar(resolvedGrammar);
        setDialogue(resolvedDialogue?.dialogue);

    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar navigation */}
            <aside className="w-64 bg-gray-100 border-r p-4">
                <h2 className="text-lg font-semibold mb-4">{lesson?.title}</h2>
                <p className="text-sm text-gray-600 mb-6">{lesson?.description}</p>
                <ul className="space-y-2">
                    {steps.map((step, idx) => (
                        <li key={step?.id}>
                            <button
                                onClick={() => setStepIndex(idx)}
                                className={`w-full text-left px-3 py-2 rounded-md ${
                                    stepIndex === idx ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                                }`}
                            >
                                {idx + 1}. {step?.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main content */}
            <main className="flex-col flex flex-1 p-6">
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Current step content */}
                <div className="flex-1 overflow-hidden mb-8">{steps[stepIndex]?.content}</div>

                {/* Navigation buttons */}
                <div className="flex justify-between">
                    <button
                        disabled={stepIndex === 0}
                        onClick={() => setStepIndex(stepIndex - 1)}
                        className="px-4 py-2 rounded-md bg-gray-300 disabled:opacity-50"
                    >
                        Back
                    </button>
                    <button
                        disabled={stepIndex === steps.length - 1}
                        onClick={() => setStepIndex(stepIndex + 1)}
                        className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
};


interface GrammarBrowserProps {
    grammarRules: GrammarRule[];
}

function GrammarBrowser({ grammarRules }: GrammarBrowserProps) {
    const [index, setIndex] = useState(0);

    if (!grammarRules || grammarRules.length === 0)
        return <p>No grammar rules found.</p>;

    return (
        <div className="flex flex-col gap-6">
            <GrammarDetail item={grammarRules[index]} />
            <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex items-center gap-2 mt-4">
                    <Button
                        onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                        disabled={index === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => setIndex((i) => Math.min(i + 1, grammarRules.length - 1))}
                        disabled={index === grammarRules.length - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
