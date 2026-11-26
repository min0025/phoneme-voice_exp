function buildExperimentTimeline() {
  const {
    enabledPhases: phases,
    saveDebugResults,
    textMainTrialCount,
    textMainStimuli,
  } = experiment_config;

  const laterBlocks = jsPsych.randomization.shuffle([
    { modality: "text", stimuli: textMainStimuli },
    { modality: "audio", stimuli: only_voice_stimuli },
  ]).map((block, index) => {
    const blockNumber = index + 2;
    return {
      ...block,
      blockNumber,
      enabled: phases[`block${blockNumber}`],
      showInstructions: phases[`block${blockNumber}Instructions`],
    };
  });

  const hasTextBlock = laterBlocks.some(({ modality, enabled }) => enabled && modality === "text");
  if (hasTextBlock && (
      !Array.isArray(textMainStimuli) || textMainStimuli.length !== textMainTrialCount ||
      textMainStimuli.some(stim => !stim?.id || typeof stim.text !== "string" || !stim.text.trim()) ||
      new Set(textMainStimuli.map(stim => stim.id)).size !== textMainTrialCount)) {
    return [{
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<p>文字刺激を${textMainTrialCount}件設定してから実験を開始してください。</p>`,
      choices: "NO_KEYS",
    }];
  }

  const withGap = trials => trials.length > 0 && phases.gaps ? [...trials, gap] : trials;
  const when = (enabled, trial) => enabled ? withGap([trial]) : [];
  const evaluation = (enabled, stimuli, options) => {
    if (!enabled) return [];
    const orderedStimuli = options.modality === "audio" ? jsPsych.randomization.shuffle([...stimuli]) : stimuli;
    return withGap(createEvaluationTrials(orderedStimuli, options));
  };

  const fullExperiment = Object.entries(phases).every(([phase, enabled]) =>
    phase === "workerId" || phase === "screening" || phase === "saveResults" || enabled
  );
  const shouldSave = phases.saveResults && (fullExperiment || saveDebugResults);
  const finishTimeline = shouldSave
    ? createDataPipeTimeline(!fullExperiment, phases.completionScreen)
    : (phases.completionScreen ? [debug_end] : []);

  return [
    ...when(phases.consent, consent_form),
    ...when(phases.workerId, worker_id_form),
    ...when(phases.screening, screening),
    ...when(phases.volumeAdjustment, volume_adjustment),
    ...when(phases.screening, record_screening_result),
    ...when(phases.overview || phases.fullscreen, createExperimentNotice(phases.overview, phases.fullscreen)),
    ...when(phases.precautions, createPrecautionsNotice(phases.fullscreen, phases.postExperimentSurvey)),
    ...when(phases.practiceInstructions, practice_intermission),
    ...evaluation(phases.practice, practice_stimuli, { modality: "audio", phase: "practice" }),
    ...when(phases.block1Instructions, phases.practice ? intermission : createBlockNotice(1, "audio")),
    ...evaluation(phases.block1, phoneme_voice_stimuli, { blockNumber: 1, modality: "audio", phase: "main" }),
    ...laterBlocks.flatMap(({ blockNumber, modality, stimuli, enabled, showInstructions }) => [
      ...when(showInstructions, createBlockNotice(blockNumber, modality)),
      ...evaluation(enabled, stimuli, { blockNumber, modality, phase: "main" }),
    ]),
    ...when(phases.demographics, demographics),
    ...when(phases.postExperimentSurvey, post_experiment_survey),
    ...(phases.fullscreen ? [exit_fullscreen] : []),
    ...finishTimeline,
  ];
}

const experimentTimeline = buildExperimentTimeline();
jsPsych.run(experimentTimeline.length ? experimentTimeline : [{
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p>有効な画面・試行がありません。実験設定を確認してください。</p>",
  choices: "NO_KEYS",
}]);
