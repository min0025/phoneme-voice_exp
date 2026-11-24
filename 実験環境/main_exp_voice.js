// =========================
// 本実験全体のフロー
// =========================
function main_experiment() {
  const {
    firstAudioBlockTrialCount,
    textMainStimuli,
  } = experiment_config;

  const audioStimuli = jsPsych.randomization.shuffle([...all_stimuli]);
  if (!Number.isInteger(firstAudioBlockTrialCount) ||
      firstAudioBlockTrialCount < 1 ||
      firstAudioBlockTrialCount >= audioStimuli.length) {
    throw new RangeError("第1ブロックの試行数は1以上、音声の総数未満にしてください。");
  }

  const audioPractice = createEvaluationTrials(
    jsPsych.randomization.shuffle([...practice_stimuli]),
    { modality: "audio", phase: "practice" }
  );
  const firstAudioBlock = createEvaluationTrials(
    audioStimuli.slice(0, firstAudioBlockTrialCount),
    { blockNumber: 1, modality: "audio", phase: "main" }
  );
  const secondAudioBlock = createEvaluationTrials(
    audioStimuli.slice(firstAudioBlockTrialCount),
    { blockNumber: 2, modality: "audio", phase: "main" }
  );
  const textBlock = createEvaluationTrials(textMainStimuli, {
    blockNumber: 3, modality: "text", phase: "main",
  });

  // 空の文字ブロックで実験を完了できないようにします。
  const textTimeline = textBlock.length > 0 ? [
    text_block_notice,
    gap,
    ...textBlock,
    gap,
  ] : [{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>第3ブロックの文字刺激が設定されていないため、実験を続けられません。</p>",
    choices: "NO_KEYS",
  }];

  return [
    experiment_notice,
    gap,
    fullscreen_notice,
    gap,
    practice_intermission,
    gap,
    ...audioPractice,
    gap,
    intermission,
    gap,
    ...firstAudioBlock,
    gap,
    second_audio_block_notice,
    gap,
    ...secondAudioBlock,
    gap,
    ...textTimeline,
    demographics,
    gap,
    post_experiment_survey,
    gap,
    exit_fullscreen,
  ];
}
