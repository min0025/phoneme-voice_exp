function spaceInstructionButton() {
  const buttonContainer = document.querySelector("#jspsych-html-button-response-btngroup");
  const button =
    document.querySelector("#jspsych-html-button-response-button-0 button") ||
    document.querySelector("#jspsych-html-button-response-button-0");

  if (!button) return;

  if (buttonContainer) {
    buttonContainer.style.marginTop = "0";
  }

  button.style.marginTop = "0";
  button.style.marginBottom = "48px";
}

// 音声評価の手順を課題説明と本試行前の確認で共通して使います。
const voice_task_steps_html = `
  <ol style="font-size: 18px; line-height: 1.9; padding-left: 1.8em; margin: 0 0 28px 0;">
    <li style="margin-bottom: 18px;">
      「再生」をクリックして、音声を最後まで聞いてください。<b>各音声は一度だけ再生できます。</b>
    </li>
    <li style="margin-bottom: 18px;">
      再生後、<b>Q1で音声の印象を6項目それぞれ7段階で、Q2で音声の自然さを7段階で</b>評価してください。
      Q3では最も当てはまる人物像を1つ選び、Q4ではQ3で選んだ人物像も含めて、当てはまるものをすべて選んでください。
    </li>
  </ol>
`;

const next_stimulus_instruction = "すべての項目に回答すると「次へ」を押せるようになります。";

// 本実験の概要と全画面化の予告を出す最初の説明ページです。
function createExperimentNotice(showOverview, fullscreen) {
  const message = `
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 32px; box-sizing: border-box;">
        ${showOverview ? `
        <h1>本実験に進む前に</h1><br>
        <p style="font-size: 20px">この度は、実験にご参加くださりありがとうございます。</p>
        <p style="font-size: 20px">第1ブロックでは音声を聞いていただきます。第2・第3ブロックでは、音声を聞く課題と画面に表示された文字を読む課題を行い、それぞれの印象や想起する人物像を回答していただきます。</p>
        <p style="font-size: 20px">実験の所要時間は、説明、事後アンケートを含めて30分程度です。</p>` : "<h1>全画面表示</h1>"}
        ${fullscreen ? '<p style="font-size: 20px"><u><b>次の画面から全画面表示に切り替わります。</b></u></p>' : ""}
        <p style="font-size: 20px; margin-bottom: 50px;">内容を確認できましたら、下の「次へ」をクリックしてください。</p>
      </div>`;

  return fullscreen
    ? { type: jsPsychFullscreen, fullscreen_mode: true, message, button_label: "次へ" }
    : { type: jsPsychHtmlButtonResponse, stimulus: message, choices: ["次へ"] };
}

function createPrecautionsNotice(fullscreen, postExperimentSurvey) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 32px; box-sizing: border-box; text-align: left; color: #000;">
        <h1 style="font-size: 34px; text-align: center; margin: 22px 0 28px 0;">注意事項</h1>
        <p style="font-size: 20px; margin: 0 0 8px 0;">下記の注意事項をよく読んでください。</p>
        <p style="font-size: 20px; margin: 0 0 18px 0;">
          <U>注意事項を守らずに不具合が生じた場合、謝礼をお支払いできないことがありますので、ご注意ください。</U>
        </p>
        <ul style="font-size: 18px; line-height: 1.7; padding-left: 1.6em; margin: 0 0 36px 0;">
          ${fullscreen ? `<li style="margin-bottom: 18px;">
            <strong><U>全画面表示は絶対に解除しないでください。</U></strong>
            実験が終了すると自動的に解除されます。参加を途中で取りやめる場合のみ、ご自身で解除してください。
          </li>` : ""}
          <li style="margin-bottom: 18px;">
            参加を取りやめたい場合は、<u><b>${fullscreen ? "Escキーを押して" : ""}ブラウザを閉じてください。</b></u>
            <strong><U>ただし、実験の参加を途中で取りやめた場合、謝礼はお支払いできませんのでご注意ください。</U></strong>
          </li>
          <li style="margin-bottom: 18px;">
            <strong><U>課題中は、音楽やテレビ等は視聴しないでください。</U></strong>
            携帯電話・スマートフォンは電源を切るか、目につかない場所に保管してください。
          </li>
          <li style="margin-bottom: 18px;">
            <strong><U>課題中は、できる限り他の事をしないでください。</U></strong>
            お手洗い等は、課題が始まる前にお済ませください。
            ${postExperimentSurvey ? "やむを得ない事情により課題を中断した場合は、その旨を必ず事後アンケートにご記入ください。" : ""}
          </li>
          <li style="margin-bottom: 0;">
            <strong><U>これから行う課題は、個人の認知能力や深層心理を調べるためのものではありません。</U></strong>
            あまり深く考えすぎずに、リラックスして取り組んでください。
          </li>
        </ul>
        <p style="font-size: 20px; font-weight: bold; margin: 0 0 50px 0;">
          注意事項を確認し、ご了承いただけた場合は、最後に「次へ」をクリックしてください。
        </p>
      </div>`,
    choices: ["次へ"],
  };
}

// 音声と文字の評価課題を説明するページです。
const practice_intermission = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
      <div style="max-width: 1280px; margin: 0 auto; padding: 52px 32px 72px; box-sizing: border-box; text-align: left; color: #000;">
        <h1 style="font-size: 34px; text-align: center; margin: 0 0 48px 0;">印象評価課題について</h1>
        <p style="font-size: 20px; margin: 0 0 20px 0;">
          音声を聞く課題と、画面に表示された文を読む課題があります。それぞれについて、感じた印象や思い浮かんだ人物像を回答してください。
        </p>
        <h2 style="font-size: 22px; margin: 28px 0 16px;">音声を聞く課題（Q1〜Q4）</h2>
        <p style="font-size: 20px; margin: 0 0 20px 0;">
          <b><u>「イヤホン」または「ヘッドホン」を装着していることを、ここでもう一度ご確認ください。可能であれば「有線」のものをご使用ください。</u></b>
        </p>
        <p style="font-size: 20px; margin: 0 0 20px 0;">
          <b><u>また、パソコンのサウンド環境が「モノラル」ではなく「ステレオ」になっていることもご確認ください。</u></b>
        </p>
        ${voice_task_steps_html}
        <img class="task-flow-image" src="./assets/images/audio-task-flow.png"
             alt="音声の手順。再生して最後まで聞く。印象、自然さ、人物像の4問に答えて次の音声へ進む。">
        <h2 style="font-size: 22px; margin: 28px 0 16px;">文字を読む課題（Q1〜Q3）</h2>
        <ol style="font-size: 18px; line-height: 1.9; padding-left: 1.8em; margin: 0 0 28px 0;">
          <li style="margin-bottom: 18px;">画面上部に表示される文を読み、その下の設問に回答してください。</li>
          <li style="margin-bottom: 18px;">
            <b>Q1で文の印象を6項目それぞれ7段階で</b>評価してください。
            Q2では最も当てはまる人物像を1つ選び、Q3ではQ2で選んだ人物像も含めて、当てはまるものをすべて選んでください。
          </li>
        </ol>
        <img class="task-flow-image" src="./assets/images/text-task-flow.png"
             alt="文章の手順。画面上部の文を読む。印象と人物像の3問に答えて次の文章へ進む。">
        <p style="font-size: 18px; margin: 0 0 24px 0;">
          どちらの課題も、あまり深く考えすぎず、感じたままに回答してください。${next_stimulus_instruction}
        </p>
        <p style="font-size: 20px; margin: 0;">
          ${experiment_config.enabledPhases.practice ? "このあと、音声を聞く課題の練習を行います。" : ""}
          準備ができたら「次へ」をクリックしてください。
        </p>
      </div>`,
  choices: ["次へ"],
  on_load: spaceInstructionButton,
};

// 練習後に本試行前の確認をしてもらうページです。
const intermission = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
      <div style="max-width: 1280px; margin: 0 auto; padding: 52px 32px 72px; box-sizing: border-box; text-align: left; color: #000;">
        <h1 style="font-size: 34px; text-align: center; margin: 0 0 48px 0;">練習は以上になります</h1>
        <p style="font-size: 20px; margin: 0 0 18px 0;">
          音声が流れないとか、画面が固まってしまったなど問題はありませんでしたか？ もし、不具合がありましたら、お手数ですが、<u><b>Escキー</b></u>を押して同意取得からやり直してみてください。
        </p>
        <p style="font-size: 20px; margin: 0 0 18px 0;">
          <b><u>本番に進む前に、「イヤホン」または「ヘッドホン」を装着していることをもう一度ご確認ください。可能であれば「有線」のものをご使用ください。</u></b>
        </p>
        <p style="font-size: 20px; margin: 0 0 18px 0;">
          <b><u>また、パソコンのサウンド環境が「モノラル」ではなく「ステレオ」になっていることもご確認ください。</u></b>
        </p>
        <p style="font-size: 20px; margin: 0 0 20px 0;">
          下記の手順を今一度ご確認ください。
        </p>
        ${voice_task_steps_html}
        <p style="font-size: 17px; margin: 0 0 18px 0;">${next_stimulus_instruction}</p>
        <p style="font-size: 17px; margin: 0 0 18px 0;">
          ※もし、現段階や実験中に参加を取りやめます場合は、<u><b>Escキー</b></u>を押してブラウザを閉じてください。（謝礼はお支払いできませんのでご了承ください）
        </p>
        <p style="font-size: 20px; margin: 0;">
          準備ができたら「次へ」ボタンを押して、第1ブロックの本試行に進んでください。
        </p>
      </div>`,
  choices: ["次へ"],
  on_load: spaceInstructionButton,
};

function createBlockNotice(blockNumber, modality) {
  const instruction = modality === "audio"
    ? "音声を最後まで聞いて、印象と自然さを評価し、想起する人物像を選んでください。"
    : "画面に表示される文字を読んで、印象と想起する人物像を回答してください。";

  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <h1>第${blockNumber}ブロック</h1>
      <p>${instruction}</p>
      <p>すべての項目に回答すると「次へ」ボタンを押せるようになります。</p>
    `,
    choices: ["次へ"],
  };
}

// 実験本体の終了後に全画面表示を解除する処理です。
const exit_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0,
};
