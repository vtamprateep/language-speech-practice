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

        var message: VoiceMessage;

        if (audioUrl) {
            message = {
                sender: user,
                audioUrl: audioUrl
            }
        } else {
            const audioBlob = await generateAudio({
                text: text!,
                language: "MANDARIN"
            });
            message = {
                sender: user,
                audioUrl: URL.createObjectURL(audioBlob)
            }
        }

        if (firstRender) {
            setMessages([message]);
        } else {
            setMessages(prev => [...prev, message]);
        }
    }

    const handleIncorrectAttempt = async (text: string) => {
        console.log("Not similar enough, try again!");
        setCountIncorrect(countIncorrect + 1);
        setTranslationPopup(text);
        setTimeout(() => setTranslationPopup(null), 2000);  
    }

    const evaluateUserAudio = async (data: Blob) => {
        // Transcribe and translate audio, calc similarity
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
            setDialogue(dialogue.slice(1))
        }
    }

    useEffect(() => {  // On mount, grab appropriate dialogue
        const copyDialogueSet = dialogueSet.slice();
        setDialogue(copyDialogueSet);
        createMessage("bot", copyDialogueSet[0].mandarin, undefined, true); // Load first message
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    useEffect(() => {
        if (audioData) evaluateUserAudio(audioData);
    }, [audioData])

    return (
        <div className="flex flex-col h-screen p-4">
            <ScrollArea className="flex-1 mb-4 pr-2">
                {messages.map((msg, i) => (
                    <div
                        key={i} 
                        className={`
                            relative max-w-[75%] rounded-2xl shadow-md flex-shrink-0
                            ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} px-2
                            animate-slide-in
                        `}
                    >
                        <Card
                            className={`
                                relative max-w-[75%] rounded-2xl shadow-md flex-shrink-0
                                ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}
                                animate-slide-in
                            `}
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
                <Alert className="mb-2 p-2 bg-black bg-opacity-80 text-white rounded-md text-sm text-center animate-fade-in-out">
                    <AlertDescription>🗣️ You said: {translationPopup}</AlertDescription>
                    
                </Alert>
            )}

            {dialogue[0]?.userPrompt && (
                <Alert className="mb-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-sm">
                    <AlertDescription>🎯 Next Prompt: {dialogue[0].userPrompt}</AlertDescription>
                </Alert>
            )}

            {countIncorrect >= 3 && dialogue[0].hint && (
                <Alert className="mb-2 p-2 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm">
                    <AlertDescription>💡 Hint: {dialogue[0].hint}</AlertDescription>
                    
                </Alert>
            )}

            <AudioRecorder 
                onRecordingComplete={setAudioData}
            />
        </div>
    );
}
