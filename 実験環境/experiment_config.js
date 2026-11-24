const experiment_config = {
  // false にするとクラウドワークス作業者IDの入力画面を省略します。
  collectWorkerId: false,

  // false にするとヘッドホン・イヤホンのスクリーニングを省略します。
  enableScreening: false,

  // パスは experiment.html を基準に指定します。
  volumeAudioPath: "./assets/practice/VOICEACTRESS100_026_006.wav",

  // デバッグ用。false にしたフェーズを省略し、結果はDataPipeに送信しません。
  // block2 / block3 は提示順の番号です。音声・文字の割り当てはランダムです。
  enabledPhases: {
    practice: true,
    block1: false,
    block2: false,
    block3: true,
  },

  // 第1ブロックは10話者×6種類、後半の音声ブロックは同じ10話者のニュートラル音声です。
  audioSpeakerIds: ["jvs016", "jvs028", "jvs034", "jvs042", "jvs043", "jvs045", "jvs079", "jvs084", "jvs090", "jvs091"],
  phonemeVoiceLabels: ["あたし型", "おれ型", "ぼく型", "わがはい型", "わし型", "わたくし型"],

  // 第2・第3ブロックの音声と文字の順序を参加者ごとにランダムに決めます。
  // 文字ブロック内では配列に記載した順に提示します。id は重複させないでください。
  // 追加する項目の形式は { id: "text_01", text: "提示する文字列" } です。
  textMainTrialCount: 6,
  textMainStimuli: [],

  // DataPipeへの保存先とCSVファイル名の接頭辞です。
  dataPipeExperimentId: "ibgfsqbZCYS1",
  resultFilenamePrefix: "characteristic_voice",
};
