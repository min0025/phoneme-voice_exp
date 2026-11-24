const confirmationCode = Math.floor(Math.random() * 90000) + 10000;
const jsPsych = initJsPsych();

function createResultFilename() {
  const now = new Date();
  const twoDigits = value => String(value).padStart(2, "0");
  const date = `${now.getFullYear()}${twoDigits(now.getMonth() + 1)}${twoDigits(now.getDate())}`;
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()].map(twoDigits).join("");
  const subjectId = jsPsych.randomization.randomID(10);
  return `${experiment_config.resultFilenamePrefix}${date}-${time}-${subjectId}.csv`;
}

// 画面切り替え時のインターバルです。
const gap = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "",
  trial_duration: 300,
};

const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: experiment_config.dataPipeExperimentId,
  filename: createResultFilename(),
  data_string: () => jsPsych.data.get().csv(),
};

// 保存後に確認コードを表示して終了案内を出す画面です。
const thanks = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
      '<div style="max-width: 900px; margin: 40px auto 0; text-align: center;">' +
      '<p style="font-size: 28px; margin: 0 0 6px 0;">この度は、調査へのご協力ありがとうございました。</p>' +
      '<p style="font-size: 28px; margin: 0 0 6px 0;">参加確認の際に、下記の確認コードが必要になります。</p>' +
      '<p style="font-size: 28px; margin: 0 0 44px 0;"><u><b>必ず控えを取っておいてください。</b></u></p>' +
      `<p style="font-size: 56px; font-weight: bold; margin: 0 0 56px 0;">${confirmationCode}</p>` +
      '<p style="font-size: 22px; margin: 0;"><u>メモが取れましたら、ウィンドウを閉じて実験を終了してください。</u></p>' +
      '</div>',
    choices: "NO_KEYS"
};
