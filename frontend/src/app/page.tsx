'use client';

import { useState, useRef, useEffect } from 'react';
import Link from "next/link"
import { guidedScenarios } from "@/data/scenarios"


export default function HomePage() {

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-black">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Choose a guided scenario to get started
            </h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {guidedScenarios.map((scenario) => (
                    <div
                        key={scenario.id}
                        className="border border-gray-200 rounded-lg p-4 w-72 text-center shadow-sm hover:shadow-md transition"
                    >
                        <h2 className="text-xl font-semibold">{scenario.title}</h2>
                        <p className="text-gray-600">{scenario.description}</p>
                            <Link
                                href={`/session/text/${scenario.path}`}
                                className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Text        
                            </Link>
                            <Link
                                href={`/session/audio/${scenario.path}`}
                                className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Audio        
                            </Link>
                    </div>

                    
                ))}
            </div>
        </main>
    );
}
