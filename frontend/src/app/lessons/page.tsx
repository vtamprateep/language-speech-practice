"use client"

import Link from "next/link"
import { allDialogue } from "@/data/dialogue"
import { lessonKeys } from "@/data/lessons";

export default function LessonHomePage() {
    return (
        <main className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
            {/* ===== Hero / Lesson Modules ===== */}
            <h1 className="text-4xl font-bold mb-4">Choose a lesson to get started</h1>
            <p className="text-gray-600 mb-10 text-lg">
                Follow structured lessons to build vocabulary, grammar, and real conversation skills.
            </p>

            <div
                className="
                    grid gap-6 
                    grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]
                    justify-center
                "
            >
                {lessonKeys.map((lesson, index) => (
                    <Link
                        key={lesson.id}
                        href={`/lessons/${lesson.id}`}
                        className="bg-white border border-blue-500 rounded-xl p-6 shadow-sm hover:shadow-md transition text-left"
                    >
                        <h2 className="text-xl font-semibold mb-2 text-blue-600">
                            Lesson {index + 1}: {lesson.title}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {lesson.description}
                        </p>
                    </Link>
                ))}
                
            </div>
        </main>
    )
}