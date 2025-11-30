'use client';

import Link from "next/link"
import { allDialogue } from "@/data/dialogue"

export default function HomePage() {

    const vocabLevels = ["1", "2", "3", "4", "5"]

    return (
        <main className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
            {/* ===== Practice Modules ===== */}
            <section className="w-full text-center max-w-5xl">
                <h2 className="text-3xl font-bold text-center mb-4">Practice Modules</h2>
                <p className="text-gray-600 mb-10 text-lg">Sharpen your skills by focusing on specific areas.</p>
                <div className="grid gap-10 md:grid-cols-3">
                    {/* Vocabulary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition text-center">
                        <h3 className="text-lg font-semibold mb-3 text-emerald-700">Vocabulary Flashcards</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Refresh on old or learn new vocabulary.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {vocabLevels.map((level) => (
                                <Link
                                    key={level}
                                    href={`/flashcards/${level}`}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Level {level}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Grammar */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition text-center">
                        <h3 className="text-lg font-semibold mb-3 text-indigo-700">Grammar Rules</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Explore explanations, examples, and practice sentences.
                        </p>
                        <Link
                            href="/grammar"
                            className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                            Browse Grammar
                        </Link>
                    </div>

                    {/* Guided Dialogues */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition text-center">
                        <h3 className="text-lg font-semibold mb-3 text-sky-700">Guided Dialogues</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Practice natural conversations through guided scenarios.
                        </p>
                        <div className="flex justify-center gap-3 flex-wrap">
                            {allDialogue.map((dialogue) => (
                                <Link
                                    key={dialogue.id}
                                    href={`/guided_dialogue/text/${dialogue.id}`}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                                >
                                    {dialogue.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
