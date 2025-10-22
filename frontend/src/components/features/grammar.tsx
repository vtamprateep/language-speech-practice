import { useState } from 'react';
import { GrammarPracticeItem, type GrammarRule } from '@/data/grammar';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Input } from '../ui/input';


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
                                <GrammarPractice practice={item.practice} />
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


function GrammarPractice({ practice }: { practice: GrammarPracticeItem[] }) {
    const [index, setIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleCheck = () => {
        // Simple feedback: if user typed exactly what is in practice sentence
        if (userInput.trim() === practice[index].answer.trim()) {
            setFeedback('✅ Correct!');
        } else {
            setFeedback(`❌ Try again. Correct: ${practice[index]}`);
        }
    };

    const handleNext = () => {
        setFeedback(null);
        setUserInput('');
        setIndex((i) => Math.min(i + 1, practice.length - 1));
    };

    const handlePrev = () => {
        setFeedback(null);
        setUserInput('');
        setIndex((i) => Math.max(i - 1, 0));
    };

    return (
        <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{practice[index].prompt}</p>
            {/* <p className="text-sm text-muted-foreground">{practice[index].fragments}</p> */}

            <p className="text-sm text-muted-foreground">
                Sentence Fragments: {practice[index].fragments.join(', ')}
            </p>

            <div className="flex gap-2">
                <Input
                    placeholder="Type your answer..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <Button onClick={handleCheck}>Check</Button>
            </div>
            {feedback && <p className="text-sm">{feedback}</p>}

            <div className="flex gap-2 mt-2">
                <Button onClick={handlePrev} disabled={index === 0}>Previous</Button>
                <Button onClick={handleNext} disabled={index === practice.length - 1}>Next</Button>
            </div>
        </div>
    );
}