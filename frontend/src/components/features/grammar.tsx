import { useState } from 'react';
import { type GrammarRule } from '@/data/grammar';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';


export function GrammarPreviewCard({ item, callback }: { item: GrammarRule, callback?: (item: GrammarRule) => void }) {
    return (
        <Card
            key={item.id}
            className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => callback?.(item)}
        >
            <h2 className="text-lg font-semibold text-black">{item.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
            </p>
        </Card>
    );
}


export function GrammarDetail({ item }: { item: GrammarRule }) {
    return (
        <ScrollArea className="flex-1 p-6">
            {item ? (
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>{item.title}</CardTitle>
                        {item.description && (
                            <p className="text-muted-foreground mt-2">
                                {item.description}
                            </p>
                        )}
                    </CardHeader>

                    <CardContent>
                        <Separator className="my-4" />
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Examples</h3>
                                <ul className="list-disc pl-6 text-sm text-muted-foreground">
                                    {item.examples.map((ex, i) => (
                                        <li key={i}>{ex}</li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold mb-2">Practice Sentences</h3>
                                <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
                                    {item.practice.map((p, i) => (
                                        <li key={i}>{p}</li>
                                    ))}
                                </ol>
                            </section>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a grammar rule to view details
                </div>
            )}
        </ScrollArea>
    )
}