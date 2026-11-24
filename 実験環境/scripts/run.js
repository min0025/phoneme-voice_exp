function buildExperimentTimeline() {
  const {
    collectWorkerId,
    enableScreening,
    textMainTrialCount,
    textMainStimuli,
  } = experiment_config;

  if (!Array.isArray(textMainStimuli) || textMainStimuli.length !== textMainTrialCount ||
      textMainStimuli.some(stim => !stim?.id || typeof stim.text !== "string" || !stim.text.trim()) ||
      new Set(textMainStimuli.map(stim => stim.id)).size !== textMainTrialCount) {
    return [{
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<p>文字刺激を${textMainTrialCount}件設定してから実験を開始してください。</p>`,
      choices: "NO_KEYS",
    }];
  }

  const audioPractice = createEvaluationTrials(
    jsPsych.randomization.shuffle([...practice_stimuli]),
    { modality: "audio", phase: "practice" }
  );
  const firstAudioBlock = createEvaluationTrials(
    jsPsych.randomization.shuffle([...phoneme_voice_stimuli]),
    { blockNumber: 1, modality: "audio", phase: "main" }
  );
  const laterBlocks = jsPsych.randomization.shuffle([
    { modality: "text", stimuli: textMainStimuli },
    { modality: "audio", stimuli: jsPsych.randomization.shuffle([...only_voice_stimuli]) },
  ]);
  const laterTimeline = laterBlocks.flatMap(({ modality, stimuli }, index) => {
    const blockNumber = index + 2;
    return [
      createBlockNotice(blockNumber, modality),
      gap,
      ...createEvaluationTrials(stimuli, { blockNumber, modality, phase: "main" }),
      gap,
    ];
  });

  return [
    consent_form,
    gap,
    ...(collectWorkerId ? [worker_id_form, gap] : []),
    ...(enableScreening ? [screening, gap] : []),
    volume_adjustment,
    gap,
    ...(enableScreening ? [record_screening_result, gap] : []),
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
    ...laterTimeline,
    demographics,
    gap,
    post_experiment_survey,
    gap,
    exit_fullscreen,
    save_data,
    thanks,
  ];
}

jsPsych.run(buildExperimentTimeline());
