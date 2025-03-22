const textToSpeech = (text: string, speech_synthesis_utterance: SpeechSynthesisUtterance) => {
    /**
     * Takes in text for pages currently visible on screen and the users utterance settings
     * 
     * Reads the text given outloud in the users desired utterance settings
     */
    speech_synthesis_utterance.text = text;
    window.speechSynthesis.speak(speech_synthesis_utterance);
}

export {textToSpeech};
