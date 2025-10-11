"use client";

import { useState } from "react";
import { LessonModule } from "@/data/lessons"; // adjust path to where you defined LessonModule
import { VocabularyFlashcard } from "@/components/features/flashcard";
import { GuidedDialogueText } from "@/components/features/dialogue";
import { GuidedDialogueAudio } from "@/components/features/dialogue";

interface LessonPageProps {
    lesson: LessonModule;
}

const LessonPage: React.FC<LessonPageProps> = ({ lesson }) => {
    const steps = [
        { id: "vocabulary", label: "Vocabulary", content: <VocabularyFlashcard item={lesson.vocabulary} /> },
        { id: "grammar", label: "Grammar", content: <GrammarPractice grammar={lesson.grammar} /> },
        { id: "dialogue", label: "Dialogue", content: <GuidedDialogue dialogue={lesson.dialogue} /> },
    ];

    const [stepIndex, setStepIndex] = useState(0);

    const progress = ((stepIndex + 1) / steps.length) * 100;

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
            <main className="flex-1 p-6">
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Current step content */}
                <div className="mb-8">{steps[stepIndex].content}</div>

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

export default LessonPage;
