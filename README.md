## Motivation

As a change of pace from studying mandarin, I wanted to attempt to build some basic mandarin study application. This journey led me down a series of iterations of what landed as a flashcard application powered by some spaced-repetition-system.

### First Iteration: Guided Dialogues

One thing that has always bothered me when learning with Duolingo is that much of it is memorization and not often rooted in context. A question came to mind: is it possible to create some application that guides users through some dialogue, scoring based on semantic similarity?

This led to the first version with introduced dialogue sets containing dialogue turns. Each turn would start with a robot prompt as well as an user target response - the goal for the user was to string together some mandarin text that reasonably met the target prompt (measured via consine similarity between the resulting embedded texts). I added on some other features that allowed users to either type or speak to the application in mandarin, returning text or audio bytes from the robot response (also in mandarin). These were powered by Whisper (general speech recognition) and Kokoro text-to-speech.

### Second Iteration: Structuring Lessons

A key problem that came up is that with the guided dialogues, it doesn't really help you learn vocabulary or grammar. A way to think about language learning is that vocabulary are the building blocks of language, vocabulary is organized into thoughts via grammar, and multiple units of vocabulary + grammar communicate complex thoughts.

This iteration introduces lessons which are units of vocabulary, grammar rules, and guided dialogues that leverages this vocabulary and grammar rules.

### Third Iteration: Simplifying to SRS Flashcards

At this point, the project was getting very complex, and I realized I likely bit off more than I could chew when most of my time was spent researching mandarin language curricula. In this iteration, I moved the existing features into a browsing page and focused on making "good" flashcards. While there likely is some generally accepted order to learning vocabulary, I pulled from a dataset to see which flashcards are most encountered in everyday reading / writing and built a priority system for learning flashcards. I also implemented a basic SRS system that incrementally introduced new flashcards as prior vocabulary was mastered.

## Repository Organization

This repository is organized as a mono-repo containing the frontend, backend, and database respectively. Database section contains a script to run to set-up the relevant tables and seed in the vocabulary. (Note: Outside of the tables `vocabulary_*`, most are unused as they support features that I decided to de-prioritize).

## Tech Stack

- Frontend Framework: Next.js
- Backend Framework: FastAPI
- Database: Supabase
