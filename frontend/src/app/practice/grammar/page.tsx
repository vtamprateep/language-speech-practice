'use client';

import { grammarRules } from '@/data/grammar';
import { type GrammarRule } from '@/data/grammar';
import { GrammarDetail, GrammarPreviewCard } from '@/components/features/grammar';
import { useState } from 'react';

export default function Page() {
    const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null);
    
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/3 border-r overflow-y-auto p-4 space-y-3">
                <h1 className="text-2xl font-bold mb-4">Grammar Rules</h1>
                {grammarRules.map((rule, i) => (
                    <GrammarPreviewCard key={i} item={rule} callback={setSelectedRule} />
                ))}
            </div>
            
            {selectedRule && (
                <GrammarDetail item={selectedRule} />
            )}
        </div>
    );
}
