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
            setting === 'lang' ? newSettings.lang :
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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
        >
        <div 
            className="backdrop-blur-md bg-black/30 border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl text-white"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            autoFocus
            style={{ boxShadow: "0 0 30px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.05)" }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-white">Voice Settings</h2>
                <button 
                    onClick={onClose}
                    className="hover:cursor-pointer w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white transition-all duration-300"
                    style={{ boxShadow: "0 0 10px rgba(255,255,255,0.05)" }}
                >
                    <FiX size={18} />
                </button>
            </div>
            
            <div className="space-y-6">
                {/* Voice Selection */}
                <div className={`p-3 rounded-lg transition-all duration-300 ${
                    focusedSetting === 'voice' 
                    ? 'bg-white/10 border border-white/30' 
                    : 'border border-transparent'
                }`}
                style={focusedSetting === 'voice' ? { boxShadow: "0 0 15px rgba(255,255,255,0.05)" } : {}}
                >
                    <label className="block text-sm font-medium mb-2 text-white/80">Voice</label>
                    <div className="flex justify-between items-center">
                        <span className="text-white">
                            {voices.length > 0 && settings.voice < voices.length ? 
                                voices[settings.voice].name : 'Loading voices...'}
                        </span>
                        <span className="text-white/50 text-sm">
                            {focusedSetting === 'voice' ? 
                                'Use ← → to change' : 
                                <span className="px-2 py-1 bg-black/40 rounded-md border border-white/10">Tab</span>
                            }
                        </span>
                    </div>
                    {focusedSetting === 'voice' && (
                        <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white/80 rounded-full"
                                style={{ 
                                    width: `${(settings.voice / (voices.length - 1)) * 100}%`,
                                    boxShadow: "0 0 10px rgba(255,255,255,0.3)" 
                                }}
                            />
                        </div>
                    )}
                </div>
                
                {/* Rate Setting */}
                <div className={`p-3 rounded-lg transition-all duration-300 ${
                    focusedSetting === 'rate' 
                    ? 'bg-white/10 border border-white/30' 
                    : 'border border-transparent'
                }`}
                style={focusedSetting === 'rate' ? { boxShadow: "0 0 15px rgba(255,255,255,0.05)" } : {}}
                >
                    <label className="block text-sm font-medium mb-2 text-white/80">Rate (0.1 - 10)</label>
                    <div className="flex justify-between items-center">
                        <span className="text-white">{settings.rate.toFixed(1)}</span>
                        <span className="text-white/50 text-sm">
                            {focusedSetting === 'rate' ? 
                                'Use ← → to change' : 
                                <span className="px-2 py-1 bg-black/40 rounded-md border border-white/10">Tab</span>
                            }
                        </span>
                    </div>
                    {focusedSetting === 'rate' && (
                        <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white/80 rounded-full"
                                style={{ 
                                    width: `${(settings.rate / 10) * 100}%`,
                                    boxShadow: "0 0 10px rgba(255,255,255,0.3)" 
                                }}
                            />
                        </div>
                    )}
                </div>
                
                {/* Pitch Setting */}
                <div className={`p-3 rounded-lg transition-all duration-300 ${
                    focusedSetting === 'pitch' 
                    ? 'bg-white/10 border border-white/30' 
                    : 'border border-transparent'
                }`}
                style={focusedSetting === 'pitch' ? { boxShadow: "0 0 15px rgba(255,255,255,0.05)" } : {}}
                >
                    <label className="block text-sm font-medium mb-2 text-white/80">Pitch (0 - 2)</label>
                    <div className="flex justify-between items-center">
                        <span className="text-white">{settings.pitch.toFixed(1)}</span>
                        <span className="text-white/50 text-sm">
                            {focusedSetting === 'pitch' ? 
                                'Use ← → to change' : 
                                <span className="px-2 py-1 bg-black/40 rounded-md border border-white/10">Tab</span>
                            }
                        </span>
                    </div>
                    {focusedSetting === 'pitch' && (
                        <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white/80 rounded-full"
                                style={{ 
                                    width: `${(settings.pitch / 2) * 100}%`,
                                    boxShadow: "0 0 10px rgba(255,255,255,0.3)" 
                                }}
                            />
                        </div>
                    )}
                </div>
                
                {/* Volume Setting */}
                <div className={`p-3 rounded-lg transition-all duration-300 ${
                    focusedSetting === 'volume' 
                    ? 'bg-white/10 border border-white/30' 
                    : 'border border-transparent'
                }`}
                style={focusedSetting === 'volume' ? { boxShadow: "0 0 15px rgba(255,255,255,0.05)" } : {}}
                >
                    <label className="block text-sm font-medium mb-2 text-white/80">Volume (0 - 1)</label>
                    <div className="flex justify-between items-center">
                        <span className="text-white">{settings.volume.toFixed(1)}</span>
                        <span className="text-white/50 text-sm">
                            {focusedSetting === 'volume' ? 
                                'Use ← → to change' : 
                                <span className="px-2 py-1 bg-black/40 rounded-md border border-white/10">Tab</span>
                            }
                        </span>
                    </div>
                    {focusedSetting === 'volume' && (
                        <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white/80 rounded-full"
                                style={{ 
                                    width: `${settings.volume * 100}%`,
                                    boxShadow: "0 0 10px rgba(255,255,255,0.3)" 
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-8 p-4 text-sm text-white/60 bg-white/5 rounded-lg border border-white/10">
                <p className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 inline-flex items-center justify-center bg-black border border-white/30 rounded text-xs">⇥</span>
                    <span>Tab between settings</span>
                </p>
                <p className="flex items-center gap-2">
                    <span className="w-5 h-5 inline-flex items-center justify-center bg-black border border-white/30 rounded text-xs">←</span>
                    <span className="w-5 h-5 inline-flex items-center justify-center bg-black border border-white/30 rounded text-xs">→</span>
                    <span>Adjust values</span>
                </p>
            </div>
        </div>
        </div>
    );
};