function buildExperimentTimeline() {
  const {
    collectWorkerId,
    enableScreening,
    enabledPhases: { practice, block1, block2, block3 },
    textMainTrialCount,
    textMainStimuli,
  } = experiment_config;

  const laterBlocks = jsPsych.randomization.shuffle([
    { modality: "text", stimuli: textMainStimuli },
    { modality: "audio", stimuli: only_voice_stimuli },
  ]).map((block, index) => ({ ...block, blockNumber: index + 2 }))
    .filter(({ blockNumber }) => blockNumber === 2 ? block2 : block3);

  const hasTextBlock = laterBlocks.some(({ modality }) => modality === "text");
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

  const practiceTimeline = practice ? [
    practice_intermission,
    gap,
    ...createEvaluationTrials(jsPsych.randomization.shuffle([...practice_stimuli]), {
      modality: "audio", phase: "practice",
    }),
    gap,
  ] : [];
  const firstBlockTimeline = block1 ? [
    practice ? intermission : createBlockNotice(1, "audio"),
    gap,
    ...createEvaluationTrials(jsPsych.randomization.shuffle([...phoneme_voice_stimuli]), {
      blockNumber: 1, modality: "audio", phase: "main",
    }),
    gap,
  ] : [];
  const laterTimeline = laterBlocks.flatMap(({ blockNumber, modality, stimuli }) => [
    createBlockNotice(blockNumber, modality),
    gap,
    ...createEvaluationTrials(modality === "audio" ? jsPsych.randomization.shuffle([...stimuli]) : stimuli, {
      blockNumber, modality, phase: "main",
    }),
    gap,
  ]);
  const completeExperiment = practice && block1 && block2 && block3;

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
    ...practiceTimeline,
    ...firstBlockTimeline,
    ...laterTimeline,
    demographics,
    gap,
    post_experiment_survey,
    gap,
    exit_fullscreen,
    ...(completeExperiment ? [save_data, thanks] : [debug_end]),
  ];
}

jsPsych.run(buildExperimentTimeline());
