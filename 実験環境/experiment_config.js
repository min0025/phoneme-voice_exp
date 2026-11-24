const experiment_config = {
  // パスは experiment.html を基準に指定します。
  volumeAudioPath: "./assets/practice/VOICEACTRESS100_026_006.wav",

  // false にした画面や試行を省略します。案内と試行は個別に切り替えられます。
  // workerId と screening は任意です。それ以外を省略するとDataPipeに送信しません。
  enabledPhases: {
    consent: true,
    workerId: false,
    screening: false,
    volumeAdjustment: true,
    overview: true,
    fullscreen: true, // 入室時の全画面化と終了時の解除
    precautions: true,
    practiceInstructions: true,
    practice: false,
    block1Instructions: false,
    block1: false,
    block2Instructions: true,
    block2: true,
    block3Instructions: false,
    block3: false,
    demographics: true,
    postExperimentSurvey: true,
    saveResults: true,
    completionScreen: true,
    gaps: true, // 画面切り替え時の空白
  },

  // 第1ブロックは10話者×6種類、後半の音声ブロックは同じ10話者のニュートラル音声です。
  audioSpeakerIds: ["jvs016", "jvs028", "jvs034", "jvs042", "jvs043", "jvs045", "jvs079", "jvs084", "jvs090", "jvs091"],
  phonemeVoiceLabels: ["あたし型", "おれ型", "ぼく型", "わがはい型", "わし型", "わたくし型"],

  // 第2・第3ブロックの音声と文字の順序を参加者ごとにランダムに決めます。
  // 文字ブロック内では配列に記載した順に提示します。id は重複させないでください。
  textMainTrialCount: 7,
  textMainStimuli: [
    { id: "text_neutral", text: "今日、机の上にあった紙を三枚数え、箱に入れた" },
    { id: "text_washi", text: "わしは今日、机に置いてあった紙を三枚数えて箱に入れたのじゃ。" },
    { id: "text_wagahai", text: "わがはいは今日、机に置いてあった紙を三枚数えて箱に入れたのだ。" },
    { id: "text_boku", text: "ぼくは今日、机に置いてあった紙を三枚数えて箱に入れたのさ。" },
    { id: "text_ore", text: "おれは今日、机に置いてあった紙を三枚数えて箱に入れたんだぜ。" },
    { id: "text_atashi", text: "あたしは今日、机に置いてあった紙を三枚数えて箱に入れたのよ。" },
    { id: "text_watakushi", text: "わたくしは今日、机に置いてあった紙を三枚数えて箱に入れたのです。" },
  ],

  // DataPipeへの保存先とCSVファイル名の接頭辞です。
  dataPipeExperimentId: "ibgfsqbZCYS1",
  resultFilenamePrefix: "characteristic_voice",
};
