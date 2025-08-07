'use client';

import { useState, useRef, useEffect } from 'react';
import Link from "next/Link"
import { scenarios } from "@/data/scenarios"


export default function HomePage() {

    return (
        <main className="min-h-screen p-8 bg-white text-black">
            <h1 className="text-3xl font-bold mb-6">Choose a guided scenario to get started</h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {scenarios.map((scenario) => (
                    <Link
                        key={scenario.id}
                        href={`/scenarios/${scenario.id}`}
                        className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition"
                    >
                        <h2 className="text-xl font-semibold">{scenario.title}</h2>
                        <p className="text-gray-600">{scenario.description}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
