// =========================
// 話者性別のメタデータ
// =========================
const speaker_gender_map = {
  jvs016: "F",
  jvs028: "M",
  jvs034: "M",
  jvs042: "M",
  jvs043: "F",
  jvs045: "M",
  jvs079: "M",
  jvs084: "F",
  jvs090: "F",
  jvs091: "F",
};

// =========================
// 本試行・練習試行の刺激一覧
// =========================
function createAudioStimulus(speakerId, label, folder) {
  const stimulusId = `${speakerId}_${label}`;
  const speakerNumber = speakerId.slice("jvs".length);
  return {
    id: stimulusId,
    stim_num: speakerNumber,
    speaker_id: speakerId,
    speaker_gender: speaker_gender_map[speakerId],
    file: `./assets/voice/${folder}/${encodeURIComponent(stimulusId.normalize("NFC"))}.opus`,
  };
}

const phoneme_voice_stimuli = experiment_config.audioSpeakerIds.flatMap(speakerId =>
  experiment_config.phonemeVoiceLabels.map(label =>
    createAudioStimulus(speakerId, label, "phoneme_voice")
  )
);

const only_voice_stimuli = experiment_config.audioSpeakerIds.map(speakerId =>
  createAudioStimulus(speakerId, "ニュートラル", "only")
);

// 練習用に使う2音声のメタデータです。
const practice_stimuli = [
  {
    id: "practice_1",
    stim_num: null,
    speaker_id: "practice_1",
    speaker_gender: null,
    file: "./assets/practice/VOICEACTRESS100_026_031.wav",
  },
  {
    id: "practice_2",
    stim_num: null,
    speaker_id: "practice_2",
    speaker_gender: null,
    file: "./assets/practice/VOICEACTRESS100_026_067.wav",
  },
];
