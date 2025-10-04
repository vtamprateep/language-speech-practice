import React, { useState, useRef, useEffect } from 'react';
import { DialogueTurn } from '@/data/scenarios';
import { WaveformAudioPlayer, AudioRecorder } from '@/lib/components/ui/audio';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent } from '../ui/card';

import { translateText, transcribeAudio, calculateSimilarity, generateAudio } from '@/lib/backend';

interface VoiceMessage {
    sender: 'user' | 'bot';
    audioUrl: string;
}

export default function GuidedDialogueAudio(
    { dialogueSet }: { dialogueSet: DialogueTurn[] }
) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);
    const [countIncorrect, setCountIncorrect] = useState<number>(0);
    const [messages, setMessages] = useState<VoiceMessage[]>([]);
    const [audioData, setAudioData] = useState<Blob>();
    const [translationPopup, setTranslationPopup] = useState<string | null>(null);

    const createMessage = async (user: "bot" | "user", text?: string, audioUrl?: string, firstRender: boolean = false) => {
        if (!text && !audioUrl) throw new Error("Must provide at least one of text or audioUrl args");

        let message: VoiceMessage;

        if (audioUrl) {
            message = { sender: user, audioUrl };
        } else {
            const audioBlob = await generateAudio({
                text: text!,
                language: "MANDARIN"
            });
            message = {
                sender: user,
                audioUrl: URL.createObjectURL(audioBlob)
            };
        }

        setMessages(prev =>
            firstRender ? [message] : [...prev, message]
        );
    };

    const handleIncorrectAttempt = async (text: string) => {
        setCountIncorrect(countIncorrect + 1);
        setTranslationPopup(text);
        setTimeout(() => setTranslationPopup(null), 2000);
    };

    const evaluateUserAudio = async (data: Blob) => {
        const audioText = await transcribeAudio(data, "MANDARIN");
        const translatedText = await translateText({
            text: audioText.text,
            sourceLang: "MANDARIN",
            targetLang: "ENGLISH"
        });
        const similarityScore = await calculateSimilarity({
            text_1: translatedText.text,
            text_2: dialogue[0].targetSentence
        });

        if (similarityScore.score < 0.7) {
            handleIncorrectAttempt(translatedText.text);
            return;
        }

        await createMessage("user", undefined, URL.createObjectURL(data));
        setCountIncorrect(0);

        if (dialogue.length > 1) {
            await createMessage("bot", dialogue[1].mandarin);
            setDialogue(dialogue.slice(1));
        }
    };

    useEffect(() => {
        const copyDialogueSet = dialogueSet.slice();
        setDialogue(copyDialogueSet);
        createMessage("bot", copyDialogueSet[0].mandarin, undefined, true);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (audioData) evaluateUserAudio(audioData);
    }, [audioData]);

    return (
        <div className="flex flex-col h-screen p-4">
            <ScrollArea className="flex-1 mb-4 pr-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in mb-2`}
                    >
                        <Card
                            className={`max-w-[75%] rounded-2xl ${
                                msg.sender === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-black rounded-bl-none'
                            }`}
                        >
                            <CardContent className="p-2">
                                <WaveformAudioPlayer src={msg.audioUrl} />
                            </CardContent>
                        </Card>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>

            {translationPopup && (
                <Alert className="mb-2 animate-fade-in-out">
                    <AlertDescription>🗣️ You said: {translationPopup}</AlertDescription>
                </Alert>
            )}

            {dialogue[0]?.userPrompt && (
                <Alert className="mb-2">
                    <AlertDescription>🎯 Next Prompt: {dialogue[0].userPrompt}</AlertDescription>
                </Alert>
            )}

            {countIncorrect >= 3 && dialogue[0].hint && (
                <Alert className="mb-2">
                    <AlertDescription>💡 Hint: {dialogue[0].hint}</AlertDescription>
                </Alert>
            )}

            <AudioRecorder onRecordingComplete={setAudioData} />
        </div>
    );
}
