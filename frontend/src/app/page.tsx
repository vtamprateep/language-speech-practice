'use client';

import Link from "next/link"
import { guidedScenarios } from "@/data/scenarios"

export default function HomePage() {

    const hskLevels = ["1", "2", "3", "4", "5", "6", "7+"]

    return (
        <main className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
            {/* Guided Scenarios */}
            <h1 className="text-3xl font-bold mb-8 text-center">
                Choose a guided scenario to get started
            </h1>

            <div 
                className="
                    grid gap-6 
                    auto-rows-max
                    grid-cols-[repeat(auto-fit,minmax(18rem,0))]
                    justify-center
                "
            >
                {guidedScenarios.map((scenario) => (
                    <div
                        key={scenario.id}
                        className="w-72 bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition"
                    >
                        <h2 className="text-lg font-semibold mb-2">{scenario.title}</h2>
                        <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                        <div className="flex justify-center gap-3">
                            <Link
                                href={`/text/${scenario.path}`}
                                className="px-3 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
                            >
                                Text
                            </Link>
                            <Link
                                href={`/audio/${scenario.path}`}
                                className="px-3 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
                            >
                                Audio
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Flashcards Section */}
            <h1 className="text-3xl font-bold mb-8 text-center">
                Vocabulary Flashcards
            </h1>

            <div 
                className="
                    grid gap-6 
                    auto-rows-max
                    grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]
                    justify-center
                    max-w-4xl w-full
                "
            >
                {hskLevels.map((level) => (
                    <Link 
                        key={level} 
                        href={`/flashcards/${level}`} 
                        className="
                            w-40
                            bg-white 
                            border 
                            border-green-500 
                            rounded-xl 
                            p-6 
                            text-center 
                            shadow-sm 
                            hover:shadow-md 
                            transition
                        "
                    >
                            <span
                                className="text-lg font-semibold mb-2"
                            >
                                HSK {level}
                            </span>
                    </Link>
                ))}
            </div>
        </main>
    );
}
