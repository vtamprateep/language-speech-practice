'use client';

import { useState } from 'react';
import { grammarRules, type GrammarRule } from '@/data/grammar';

export default function GrammarPage() {
    const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/3 border-r overflow-y-auto p-4 space-y-3">
                <h1 className="text-2xl font-bold mb-4">Grammar Rules</h1>
                {grammarRules.map(rule => (
                    <div
                        key={rule.id}
                        className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedRule(rule)}
                    >
                        <h2 className="text-lg font-semibold text-black">{rule.title}</h2>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {rule.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Detail view */}
            <div className="flex-1 p-6 overflow-y-auto">
                {selectedRule ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{selectedRule.title}</h2>
                        <p className="mb-4 text-gray-700">{selectedRule.description}</p>

                        <h3 className="text-lg font-semibold">Examples</h3>
                        <ul className="list-disc pl-6 mb-6">
                            {selectedRule.examples.map((ex, i) => (
                                <li key={i}>{ex}</li>
                            ))}
                        </ul>

                        <h3 className="text-lg font-semibold">Practice Sentences</h3>
                        <ol className="list-decimal pl-6 space-y-2">
                            {selectedRule.practice.map((p, i) => (
                                <li key={i} className="text-gray-800">
                                    {p}
                                </li>
                            ))}
                        </ol>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a grammar rule to view details
                    </div>
                )}
            </div>
        </div>
    );
}
