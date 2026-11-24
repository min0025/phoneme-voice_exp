// =========================
// 話者性別のメタデータ
// =========================
const speaker_gender_map = [
  "M", "F", "M", "F", "M", "M", "F", "F", "M", "F",
  "M", "M", "M", "F", "F", "F", "F", "F", "F", "M",
  "M", "M", "M", "F", "F", "F", "F", "M", "F", "F",
  "M", "M", "M", "M", "F", "F", "M", "F", "F", "F",
  "M", "M", "F", "M", "M", "M", "M", "M", "M", "M",
  "F", "M", "F", "M", "F", "F", "F", "F", "F", "F",
  "F", "F", "F", "F", "F", "F", "F", "M", "F", "M",
  "M", "F", "M", "M", "M", "M", "M", "M", "M", "M",
  "M", "F", "F", "F", "F", "M", "M", "M", "M", "F",
  "F", "F", "F", "F", "F", "F", "M", "M", "M", "M",
];

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
    speaker_gender: speaker_gender_map[Number(speakerNumber) - 1],
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
