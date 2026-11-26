const confirmationCode = Math.floor(Math.random() * 90000) + 10000;
const jsPsych = initJsPsych();

function createResultFilename(isDebug) {
  const now = new Date();
  const twoDigits = value => String(value).padStart(2, "0");
  const date = `${now.getFullYear()}${twoDigits(now.getMonth() + 1)}${twoDigits(now.getDate())}`;
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()].map(twoDigits).join("");
  const subjectId = jsPsych.randomization.randomID(10);
  const debugPrefix = isDebug ? "debug_" : "";
  return `${debugPrefix}${experiment_config.resultFilenamePrefix}${date}-${time}-${subjectId}.csv`;
}

// 画面切り替え時のインターバルです。
const gap = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "",
  trial_duration: 300,
};

const confirmation_form = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
    <h1>最後に、確認コードを入力してください</h1>
    <p style="font-size: 20px;">参加確認に使う5桁のコードです。控えを取ってから、同じコードを入力してください。</p>
    <p id="participant-confirmation-code" style="font-size: 56px; font-weight: bold; margin: 32px 0;">${confirmationCode}</p>
  `,
  html: `
    <p>
      <label for="confirmation-code-input">確認コード（半角数字5桁）：</label>
      <input id="confirmation-code-input" name="confirmation_code" type="text"
             inputmode="numeric" pattern="[0-9]{5}" maxlength="5" autocomplete="off" required
             aria-describedby="confirmation-code-error"
             style="width: 120px; padding: 8px; font-size: 20px;">
    </p>
    <p id="confirmation-code-error" role="alert" style="color: #a00;" hidden>
      コードが一致しません。表示された5桁の数字を確認してください。
    </p>
  `,
  button_label: "送信",
  on_load() {
    const form = document.getElementById("jspsych-survey-html-form");
    const input = document.getElementById("confirmation-code-input");
    const error = document.getElementById("confirmation-code-error");
    const submit = document.getElementById("jspsych-survey-html-form-next");

    const update = () => {
      submit.disabled = !input.validity.valid;
      error.hidden = true;
      input.removeAttribute("aria-invalid");
    };
    input.addEventListener("input", update);
    update();

    form.addEventListener("submit", event => {
      if (input.value === String(confirmationCode)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      error.hidden = false;
      input.setAttribute("aria-invalid", "true");
      input.focus();
    }, { capture: true });
  },
  on_finish(data) {
    data.confirmation_code = data.response.confirmation_code;
  },
};

// 本番の送信が受理された後に確認コードを表示します。
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

const debug_end = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<h1>デバッグ実行が終了しました</h1>",
  choices: "NO_KEYS",
};

function createDataPipeTimeline(isDebug, showCompletion) {
  const filename = createResultFilename(isDebug);
  let accepted = false;
  const saveTrial = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: experiment_config.dataPipeExperimentId,
    filename,
    data_string: () => jsPsych.data.get().csv(),
    wait_message: "<p>データを送信しています。この画面を閉じずにお待ちください。</p>",
    on_finish(data) {
      const result = data.result;
      accepted = data.success === true && Object.prototype.toString.call(result) === "[object Object]" &&
        (typeof result?.message === "string" || result?.error === null);
      if (!accepted) console.error("DataPipe submission was not confirmed:", result);
    },
  };

  if (!showCompletion) return [confirmation_form, saveTrial];

  const resultScreen = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => {
      if (!accepted) {
        return "<h1>データの送信を確認できませんでした</h1><p>この画面を閉じる前に、実験担当者にご連絡ください。</p>";
      }
      if (isDebug) {
        return `<h1>DataPipeが確認用データを受理しました</h1><p>${filename}</p>`;
      }
      return thanks.stimulus;
    },
    choices: "NO_KEYS",
  };
  return [confirmation_form, saveTrial, resultScreen];
}
