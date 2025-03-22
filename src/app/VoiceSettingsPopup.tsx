import React from 'react';
import { FiX } from 'react-icons/fi'; // Feather icons



const settingsOrder = ['voice', 'lang', 'rate', 'pitch', 'volume'];

export default function VoiceSettingsPopup({ utterance, isOpen, onClose }: { utterance: SpeechSynthesisUtterance, isOpen: boolean, onClose: () => void }): React.ReactElement | null {
    const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
    const [settings, setSettings] = React.useState({
        voice: 0,
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        lang: "en-US"
    });

    const [focusedSetting, setFocusedSetting] = React.useState<keyof VoiceSettings>("voice");

    // Available language options
    const languages = [
        "en-US", "en-GB", "es-ES", "fr-FR", "de-DE", 
        "it-IT", "ja-JP", "ko-KR", "zh-CN", "ru-RU"
    ];

    // Language display names
    const languageNames: { [key: string]: string } = {
        "en-US": "English (US)",
        "en-GB": "English (UK)",
        "es-ES": "Spanish",
        "fr-FR": "French",
        "de-DE": "German",
        "it-IT": "Italian",
        "ja-JP": "Japanese",
        "ko-KR": "Korean",
        "zh-CN": "Chinese",
        "ru-RU": "Russian"
    };

    // Load voices when component mounts
    React.useEffect(() => {
        const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
            setVoices(availableVoices);
            // Find current voice index if set
            if (utterance?.voice) {
            const currentVoiceIndex = utterance.voice ? availableVoices.findIndex(v => v.voiceURI === utterance.voice?.voiceURI) : -1;
            if (currentVoiceIndex >= 0) {
                setSettings(prev => ({ ...prev, voice: currentVoiceIndex }));
            }
            }
        }
        };

        // Load voices immediately
        loadVoices();
        
        // Also set up event listener for when voices change
        window.speechSynthesis.onvoiceschanged = loadVoices;

        // Get current settings from utterance
        if (utterance) {
        setSettings({
            voice: 0, // Will be updated in loadVoices
            rate: utterance.rate,
            pitch: utterance.pitch,
            volume: utterance.volume,
            lang: utterance.lang
        });
        }

        return () => {
        window.speechSynthesis.onvoiceschanged = null;
        };
    }, [utterance]);

    // Handle keyboard navigation
    interface VoiceSettings {
        voice: number;
        rate: number;
        pitch: number;
        volume: number;
        lang: string;
    }


    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        // Move between settings with Tab
        if (e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = settingsOrder.indexOf(focusedSetting);
        const nextIndex = e.shiftKey 
            ? (currentIndex - 1 + settingsOrder.length) % settingsOrder.length
            : (currentIndex + 1) % settingsOrder.length;
        setFocusedSetting(settingsOrder[nextIndex] as keyof VoiceSettings);
        previewNewSetting(settings, nextIndex);
        return;
        }

        // Adjust settings with arrow keys
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        const increase = e.key === 'ArrowUp' || e.key === 'ArrowRight';

        // Create a new settings object
        const newSettings: VoiceSettings = { ...settings };

        switch (focusedSetting) {
            case 'voice':
            newSettings.voice = increase
                ? (settings.voice + 1) % voices.length
                : (settings.voice - 1 + voices.length) % voices.length;
            break;
            case 'lang':
            const langIndex = languages.indexOf(settings.lang);
            const newLangIndex = increase
                ? (langIndex + 1) % languages.length
                : (langIndex - 1 + languages.length) % languages.length;
            newSettings.lang = languages[newLangIndex];
            break;
            case 'rate':
            // Rate: 0.1 to 10
            newSettings.rate = Math.max(0.1, Math.min(10, settings.rate + (increase ? 0.1 : -0.1)));
            break;
            case 'pitch':
            // Pitch: 0 to 2
            newSettings.pitch = Math.max(0, Math.min(2, settings.pitch + (increase ? 0.1 : -0.1)));
            break;
            case 'volume':
            // Volume: 0 to 1
            newSettings.volume = Math.max(0, Math.min(1, settings.volume + (increase ? 0.1 : -0.1)));
            break;
        }

        setSettings(newSettings);

        // Update the utterance with new settings
        if (utterance) {
            utterance.rate = newSettings.rate;
            utterance.pitch = newSettings.pitch;
            utterance.volume = newSettings.volume;
            utterance.lang = newSettings.lang;

            if (voices.length > 0 && newSettings.voice < voices.length) {
            utterance.voice = voices[newSettings.voice];
            }
        }

        // Play a sample to preview the changed setting
        previewNewSetting(newSettings, settingsOrder.indexOf(focusedSetting));
        }
    };

    // Preview the current setting
    const previewNewSetting = (newSettings: VoiceSettings, nextIndex: number) => {
        if (utterance) {
        // Tell user the current option they are on, i.e. "Voice", and the current value
        // i.e. "Current: English (US)"
        const tempUtterance = new SpeechSynthesisUtterance();
        const setting = settingsOrder[nextIndex];

        const previewText = `Current ${setting}: ${setting === 'voice' ?

            voices.length > 0 && newSettings.voice < voices.length ? voices[newSettings.voice].name : 'Loading voices...' :
            setting === 'lang' ? languageNames[newSettings.lang] || newSettings.lang :
            (newSettings[setting as keyof VoiceSettings] as number).toFixed(1)}`;
        
        // Copy all settings to the temporary utterance
        tempUtterance.text = previewText;
        tempUtterance.rate = utterance.rate;
        tempUtterance.pitch = utterance.pitch;
        tempUtterance.volume = utterance.volume;
        tempUtterance.lang = utterance.lang;
        tempUtterance.voice = utterance.voice;
        
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(tempUtterance);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
        >
        <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            autoFocus
        >
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Voice Settings</h2>
            <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <FiX size={24} />
            </button>
            </div>
            
            <div className="space-y-6">
            {/* Voice Selection */}
            <div className={`${focusedSetting === 'voice' ? 'bg-blue-100 dark:bg-blue-900/30 p-2 rounded' : ''}`}>
                <label className="block text-sm font-medium mb-1">Voice</label>
                <div className="flex justify-between items-center">
                <span>Current: {voices.length > 0 && settings.voice < voices.length ? 
                    voices[settings.voice].name : 'Loading voices...'}</span>
                <span className="text-gray-500 text-sm">
                    {focusedSetting === 'voice' ? 'Use ← → arrows to change' : 'Tab to focus'}
                </span>
                </div>
            </div>
            
            {/* Language Selection */}
            <div className={`${focusedSetting === 'lang' ? 'bg-blue-100 dark:bg-blue-900/30 p-2 rounded' : ''}`}>
                <label className="block text-sm font-medium mb-1">Language</label>
                <div className="flex justify-between items-center">
                <span>Current: {languageNames[settings.lang] || settings.lang}</span>
                <span className="text-gray-500 text-sm">
                    {focusedSetting === 'lang' ? 'Use ← → arrows to change' : 'Tab to focus'}
                </span>
                </div>
            </div>
            
            {/* Rate Setting */}
            <div className={`${focusedSetting === 'rate' ? 'bg-blue-100 dark:bg-blue-900/30 p-2 rounded' : ''}`}>
                <label className="block text-sm font-medium mb-1">Rate (0.1 - 10)</label>
                <div className="flex justify-between items-center">
                <span>Current: {settings.rate.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">
                    {focusedSetting === 'rate' ? 'Use ← → arrows to change' : 'Tab to focus'}
                </span>
                </div>
            </div>
            
            {/* Pitch Setting */}
            <div className={`${focusedSetting === 'pitch' ? 'bg-blue-100 dark:bg-blue-900/30 p-2 rounded' : ''}`}>
                <label className="block text-sm font-medium mb-1">Pitch (0 - 2)</label>
                <div className="flex justify-between items-center">
                <span>Current: {settings.pitch.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">
                    {focusedSetting === 'pitch' ? 'Use ← → arrows to change' : 'Tab to focus'}
                </span>
                </div>
            </div>
            
            {/* Volume Setting */}
            <div className={`${focusedSetting === 'volume' ? 'bg-blue-100 dark:bg-blue-900/30 p-2 rounded' : ''}`}>
                <label className="block text-sm font-medium mb-1">Volume (0 - 1)</label>
                <div className="flex justify-between items-center">
                <span>Current: {settings.volume.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">
                    {focusedSetting === 'volume' ? 'Use ← → arrows to change' : 'Tab to focus'}
                </span>
                </div>
            </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p>Navigate between settings with Tab key</p>
            <p>Adjust values with arrow keys (←→ or ↑↓)</p>
            </div>
        </div>
        </div>
    );
    };