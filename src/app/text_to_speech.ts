const textToSpeech = (pages: string[], curr_page: number, speech_synthesis_utterance: SpeechSynthesisUtterance) => {
    speech_synthesis_utterance.text = pages[curr_page] + " " + pages[curr_page+1];
    window.speechSynthesis.speak(speech_synthesis_utterance);
}

export {textToSpeech};
