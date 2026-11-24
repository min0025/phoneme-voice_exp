const experiment_config = {
  // false にするとクラウドワークス作業者IDの入力画面を省略します。
  collectWorkerId: false,

  // false にするとヘッドホン・イヤホンのスクリーニングを省略します。
  enableScreening: false,

  // 25本の音声をシャッフルし、この本数を第1ブロックに、残りを第2ブロックに割り当てます。
  firstAudioBlockTrialCount: 13,

  // 第3ブロックの刺激を、配列に記載した順に提示します。id は重複させないでください。
  // 追加する項目の形式は { id: "text_01", text: "提示する文字列" } です。
  textMainStimuli: [],
};
