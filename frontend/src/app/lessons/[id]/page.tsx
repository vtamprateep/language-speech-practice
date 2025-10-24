"use client";

import { useState, useEffect } from "react";

// Components
import { VocabularyFlashcard } from "@/components/features/flashcard";
import { GuidedDialogueText } from "@/components/features/dialogue";
import { GrammarDetail } from "@/components/features/grammar";

// Data imports
import { LessonModule, introducingYourselfLesson } from "@/data/lessons";
import { Vocabulary, tradVocabulary1 } from "@/data/vocabulary";
import { GrammarRule, grammarRules } from "@/data/grammar";
import { DialogueTurn, guidedScenariosDialogue } from "@/data/scenarios";
import { Button } from "@/components/ui/button";


export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [lesson, setLesson] = useState<LessonModule>(introducingYourselfLesson);

    const [vocabulary, setVocabulary] = useState<Vocabulary[]>();
    const [grammar, setGrammar] = useState<GrammarRule[]>();
    const [grammarIndex, setGrammarIndex] = useState<number>(0);
    const [dialogue, setDialogue] = useState<DialogueTurn[]>();

    const steps = [
        { id: "vocabulary", label: "Vocabulary", content: vocabulary ? <VocabularyFlashcard vocabulary={vocabulary} /> : null },
        { id: "grammar", label: "Grammar", content: grammar ? <GrammarBrowser grammarRules={grammar} /> : null },
        { id: "dialogue", label: "Dialogue", content: dialogue ? <GuidedDialogueText dialogueSet={dialogue} /> : null },
    ];

    const progress = ((stepIndex + 1) / steps.length) * 100;

    useEffect(() => {
        if (!lesson) return;

        // Resolve vocabulary
        const resolvedVocab = lesson.vocabularyId
            .map((vocabId) => tradVocabulary1.find((v) => v.id === vocabId))
            .filter((v): v is Vocabulary => Boolean(v));

        // Resolve grammar rules
        const resolvedGrammar = lesson.grammarId
            .map((grammarRef) => grammarRules.find((g) => g.id === grammarRef))
            .filter((g): g is GrammarRule => Boolean(g));

        // Resolve dialogue turns
        const resolvedDialogue = guidedScenariosDialogue[lesson.dialogueId];

        // Update state
        setVocabulary(resolvedVocab);
        setGrammar(resolvedGrammar);
        setDialogue(resolvedDialogue);

    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar navigation */}
            <aside className="w-64 bg-gray-100 border-r p-4">
                <h2 className="text-lg font-semibold mb-4">{lesson.title}</h2>
                <p className="text-sm text-gray-600 mb-6">{lesson.description}</p>
                <ul className="space-y-2">
                    {steps.map((step, idx) => (
                        <li key={step.id}>
                            <button
                                onClick={() => setStepIndex(idx)}
                                className={`w-full text-left px-3 py-2 rounded-md ${
                                    stepIndex === idx ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                                }`}
                            >
                                {idx + 1}. {step.label}
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
                <div className="flex-1 overflow-hidden mb-8">{steps[stepIndex].content}</div>

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
