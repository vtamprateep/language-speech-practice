'use client';

import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
            <div className="w-full max-w-xl space-y-10 text-center">

                {/* Start a new lesson */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                    <h2 className="text-3xl font-bold mb-3">Start a New Lesson</h2>
                    <p className="text-gray-600 mb-6">
                        Begin your next guided Mandarin lesson.
                    </p>
                    <Link
                        href="/learn"
                        className="inline-block px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
                    >
                        Start Learning
                    </Link>
                </div>

                {/* Practice Modules */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                    <h2 className="text-3xl font-bold mb-3">Practice Modules</h2>
                    <p className="text-gray-600 mb-6">
                        Sharpen specific skills with focused practice.
                    </p>

                    <div className="grid gap-4">
                        <Link
                            href="/practice"
                            className="block px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                        >
                            Explore Practice Modules
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
