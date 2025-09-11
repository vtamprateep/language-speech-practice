import React from 'react';


export default function FlashcardsPage({ params }: { params: Promise<{ level: string }>}) {

    const { level } = React.use(params);

    return (
        <div>
            <h1>Flashcards {level}</h1>
        </div>
    );
}