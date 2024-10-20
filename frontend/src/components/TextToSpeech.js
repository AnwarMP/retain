// ../components/TextToSpeech.js

import { useTTS } from '@cartesia/cartesia-js/react';
import { useState } from 'react';

function TextToSpeech({ text }) {
  const tts = useTTS({
    apiKey: process.env.REACT_APP_CARTESIAN_TTS_API_KEY,
    sampleRate: 44100,
  });

  // List of voices and their IDs
  const voices = [
    { name: 'Newsman', id: 'd46abd1d-2d02-43e8-819f-51fb652c1c61' },
    { name: 'Newslady', id: 'bf991597-6c13-47e4-8411-91ec2de5c466' },
    { name: 'Commercial Man', id: '7360f116-6306-4e9a-b487-1235f35a0f21' },
    { name: 'Helpful Woman', id: '156fb8d2-335b-4950-9cb3-a2d33befec77' },
    { name: 'Alabama Male', id: '40104aff-a015-4da1-9912-af950fbec99e' },
    { name: 'British Narration Lady', id: '4d2fd738-3b3d-4368-957a-bb4805275bd9' },
    { name: 'New York Man', id: '34575e71-908f-4ab6-ab54-b08c95d6597d' },
    { name: 'New York Woman', id: '34bde396-9fde-4ebf-ad03-e3a1d1155205' },
    { name: 'Sportsman', id: 'ed81fd13-2016-4a49-8fe3-c0d2761695fc' },
    { name: 'Teacher Lady', id: '573e3144-a684-4e72-ac2b-9b2063a50b53' },
    { name: 'Wise Guide Man', id: '42b39f37-515f-4eee-8546-73e841679c1d' },
    { name: 'Wise Lady', id: 'c8605446-247c-4d39-acd4-8f4c28aa363c' },
    { name: 'Southern Man', id: '98a34ef2-2140-4c28-9c71-663dc4dd7022' },
    { name: 'Southern Woman', id: 'f9836c6e-a0bd-460e-9d3c-f7299fa60f94' },
    { name: 'Midwestern Man', id: '565510e8-6b45-45de-8758-13588fbaec73' },
    { name: 'Midwestern Woman', id: '11af83e2-23eb-452f-956e-7fee218ccb5c' },
    { name: 'Announcer Man', id: '11af83e2-23eb-452f-956e-7fee218ccb5c' },
    { name: 'ASMR Lady', id: '03496517-369a-4db1-8236-3d3ae459ddf7' },
  ];

  const [selectedVoiceId, setSelectedVoiceId] = useState(voices[0].id);

  const handleVoiceChange = (event) => {
    setSelectedVoiceId(event.target.value);
  };

  const handlePlay = async () => {
    // Begin buffering the audio.
    const response = await tts.buffer({
        model_id: "sonic-english",
        voice: {
            mode: "id",
            id: selectedVoiceId,
        },
        transcript: text,
    });


    // Immediately play the audio. (You can also buffer in advance and play later.)
    await tts.play();
    }

  return (
<div className="mb-4">
      <button
        onClick={handlePlay}
        className='px-4 py-2 rounded bg-blue-400 text-white hover:bg-blue-500'
      >
        Speak
      </button>

      {/* Dropdown for voice selection */}
      <div className="mt-2">
        <label htmlFor="voiceSelect" className="mr-2">Select Voice:</label>
        <select
          id="voiceSelect"
          value={selectedVoiceId}
          onChange={handleVoiceChange}
          className="border rounded px-2 py-1 mt-3"
        >
          {voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      <div className='mt-3 mb-5'>
         Buffer Status: {tts.bufferStatus}  
      </div>
    </div>
  );
}

export default TextToSpeech;
