// ../components/TextToSpeech.js

import { useTTS } from '@cartesia/cartesia-js/react';

function TextToSpeech({ text }) {
  const tts = useTTS({
    apiKey: process.env.REACT_APP_CARTESIAN_TTS_API_KEY,
    sampleRate: 44100,
  });

  const handlePlay = async () => {
    // Begin buffering the audio.
    const response = await tts.buffer({
        model_id: "sonic-english",
        voice: {
            mode: "id",
            id: "40104aff-a015-4da1-9912-af950fbec99e",
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

      <div className='mt-3'>
        | Buffer Status: {tts.bufferStatus} | 
      </div>
    </div>
  );
}

export default TextToSpeech;
