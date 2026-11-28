// 音声・文字刺激に共通する評価項目です。
const adjectives = [
  { left: "男性的", right: "女性的" },
  { left: "幼い感じ", right: "老けた感じ" },
  { left: "親切な", right: "意地悪な" },
  { left: "暖かい", right: "冷たい" },
  { left: "強そうな", right: "弱そうな" },
  { left: "偉そうな", right: "控えめな" },
];

const likert_bio = [
  "成人男性",
  "少年",
  "おじいさん",
  "上司",
  "成人女性",
  "少女",
  "おばあさん",
  "お嬢様",
  "奥様",
  "幼児",
];

const likert_scale = [
  "<span style='font-size: 17px;'><p>とても<br>当てはまる</br></p></span>",
  "<span style='font-size: 17px;'><p>当てはまる</p></span>",
  "<span style='font-size: 17px;'><p>少し<br>当てはまる</br></p></span>",
  "<span style='font-size: 17px;'><p>どちらとも<br>いえない</br></p></span>",
  "<span style='font-size: 17px;'><p>少し<br>当てはまる</br></p></span>",
  "<span style='font-size: 17px;'><p>当てはまる</p></span>",
  "<span style='font-size: 17px;'><p>とても<br>当てはまる</br></p></span>",
];

const naturalness_scale = [
  "非常に不自然",
  "不自然",
  "やや不自然",
  "どちらともいえない",
  "やや自然",
  "自然",
  "非常に自然",
];

// =========================
// 音声・文字刺激に対する評価画面の生成
// =========================
function createEvaluationTrials(stimuli, { blockNumber = null, modality, phase }) {
  const isAudio = modality === "audio";
  const isPractice = phase === "practice";
  const stimulusLabel = isAudio ? "音声" : "文字刺激";
  const blockName = isPractice ? "practice_voice" : isAudio ? "voice_main" : "text_main";
  const trialLabel = isPractice ? "練習" : `第${blockNumber}ブロック`;
  const instructions = isAudio ? "再生ボタンで音声を聞き" : "画面に表示された文字を読み";
  const singleChoiceNumber = isAudio ? 3 : 2;
  const lastQuestionNumber = singleChoiceNumber + 1;
  const longestTextLength = isAudio ? 0 : Math.max(1, ...stimuli.map(stim => Array.from(stim.text).length));

  return stimuli.map((stim, index) => {
    const shuffled_adjectives = jsPsych.randomization.shuffle([...adjectives]);

    return {
      type: jsPsychSurveyHtmlForm,
      required: true,
      button_label: "次へ",
      html: `
  <div class="stimulus-box">
    <p style="font-size: 30px;"><b>${trialLabel} ・ ${index + 1} / ${stimuli.length} 試行</b></p>
  </div>

  ${isAudio ? "" : `
  <div class="text-stimulus-container" style="--text-stimulus-length: ${longestTextLength}">
    <div class="text-stimulus-box">
      <p id="text-stimulus" class="text-stimulus"></p>
    </div>
  </div>`}

  <p style="font-size: 19px; margin-top: 10px;">
      <b>${instructions}、Q1〜Q${lastQuestionNumber}に回答してください。</b>
  </p>

  ${isAudio ? `<p style="font-size: 19px; margin-bottom: 40px;">
      <b>※音声は一度しか流れません</b>
  </p>

  <div style="text-align: center; margin-bottom: 30px;">
    <button type="button" id="playBtn">再生</button>
    <audio id="audioElem" src="${stim.file}"></audio>
  </div>` : ""}
  <hr>

  <div id="question-area"${isAudio ? ' style="visibility: hidden; pointer-events: none;"' : ""}>
    ${isAudio ? voice_evaluation_note_html : ""}
    <p style="font-size: 19px; margin-top: 50px;">
      <b>Q1. ${stimulusLabel}の印象について、下記の項目に最もよく当てはまるものを答えてください</b>
    </p>

    <div id="sd-container">
      ${shuffled_adjectives.map((pair, i) => `
        <div class="sd-row">
          <div class="sd-label left"><span style="font-size: 24px;">${pair.left}</span></div>
          <div class="sd-scale">
            ${likert_scale.map((label, j) => `
              <div class="sd-option">
                <input type="radio" name="sd_${i}" value="${j}">
                <div class="sd-text">${label}</div>
              </div>
            `).join("")}
          </div>
          <div class="sd-label right"><span style="font-size: 24px;">${pair.right}</span></div>
        </div>
      `).join("")}
    </div>
    <hr>

    ${isAudio ? `
    <fieldset class="naturalness-question">
      <legend>Q2. 言葉と声の組み合わせは、どの程度自然に感じられましたか？</legend>
      <div class="naturalness-scale">
        ${naturalness_scale.map((label, index) => `
          <label>
            <input type="radio" name="naturalness" value="${index + 1}" disabled>
            <span>${label}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
    <hr>` : ""}

    <p style="margin-top: 45px;">
      <b style="font-size: 19px;">Q${singleChoiceNumber}. ${stimulusLabel}から想起する「人物像」として<U>最も</U>当てはまるものを<U>1つ選んでください</U></b>
    </p>
    <div class="bio-group">
      ${likert_bio.map(opt => `
        <label class="bio-option">
          <input type="radio" name="bio1" value="${opt}" disabled>
          <span>${opt}</span>
        </label>
      `).join("")}
    </div>

    <p style="margin-top: 100px;">
      <b style="font-size: 19px; margin-top: 100px;">Q${lastQuestionNumber}. ${stimulusLabel}から想起する「人物像」として当てはまるものを<U>Q${singleChoiceNumber}の回答も含めて全て選んでください</U><br>
      （Q${singleChoiceNumber}で回答した選択肢だけが当てはまる場合は、その選択肢だけを選んでください）</b>
    </p>
    <div class="bio-group">
      ${likert_bio.map(opt => `
        <label class="bio-option">
          <input type="checkbox" name="bio2_${opt}" value="${opt}" disabled>
          <span>${opt}</span>
        </label>
      `).join("")}
    </div>
  </div>
`,
      data: {
        stim_id: stim.id,
        stim_num: stim.stim_num ?? null,
        speaker_id: stim.speaker_id ?? null,
        speaker_gender: stim.speaker_gender ?? null,
        group: isPractice ? "practice" : 0,
        block: blockName,
        block_number: blockNumber,
        stimulus_modality: modality,
        stimulus_text: stim.text ?? null,
      },
      on_load: () => {
        const form = document.querySelector("#jspsych-survey-html-form");
        const submitBtn = document.querySelector("#jspsych-survey-html-form-next");

        let stimulusReady = !isAudio;

        // SD法6項目がすべて回答済みかを判定します。
        const sdOk = () =>
          shuffled_adjectives.every((_, i) =>
            !!form.querySelector(`input[name="sd_${i}"]:checked`)
          );

        const naturalnessOk = () => !isAudio || !!form.querySelector('input[name="naturalness"]:checked');

        // 単一選択の人物像が選ばれているかを判定します。
        const bio1Ok = () => !!form.querySelector('input[name="bio1"]:checked');
        // 複数選択の人物像が1つ以上選ばれているかを判定します。
        const bio2Ok = () =>
          form.querySelectorAll('input[name^="bio2_"]:checked').length > 0;
        const allOk = () => stimulusReady && sdOk() && naturalnessOk() && bio1Ok() && bio2Ok();

        // 刺激の提示状況と回答内容に応じて入力欄を更新します。
        const updateState = () => {
          form.querySelectorAll('input[name^="sd_"], input[name="naturalness"], input[name="bio1"]').forEach(el => {
            el.disabled = !stimulusReady;
          });

          const enableBio2 = stimulusReady && bio1Ok();
          form.querySelectorAll('input[name^="bio2_"]').forEach(el => {
            el.disabled = !enableBio2;
          });

          submitBtn.disabled = !allOk();
        };

        if (isAudio) {
          const questionArea = document.getElementById("question-area");
          const audio = document.getElementById("audioElem");
          const playBtn = document.getElementById("playBtn");

          playBtn.addEventListener("click", () => {
            playBtn.disabled = true;
            playBtn.textContent = "再生中...";
            audio.currentTime = 0;
            audio.play().catch(() => {
              playBtn.disabled = false;
              playBtn.textContent = "再生を再試行";
            });
          });

          audio.addEventListener("ended", () => {
            playBtn.textContent = "再生済み";
            questionArea.style.visibility = "visible";
            questionArea.style.pointerEvents = "auto";
            stimulusReady = true;
            updateState();
          });
        } else {
          document.getElementById("text-stimulus").textContent = stim.text;
        }

        updateState();
        form.addEventListener("change", updateState);

        form.addEventListener("submit", (e) => {
          updateState();
          if (!allOk()) {
            e.preventDefault();
            e.stopImmediatePropagation();
            alert("未回答があります。すべての設問に回答してください。");
          }
        }, { capture: true });

        setTimeout(() => {
          if (form && submitBtn) {
            form.appendChild(submitBtn);
            submitBtn.style.display = "block";
            submitBtn.style.margin = "120px auto";
          }
        }, 0);
      },
      // 回答結果を列ごとに整形して保存データへ追加します。
      on_finish: function (data) {
        const res = data.response || {};

        shuffled_adjectives.forEach((pair, i) => {
          const val = res[`sd_${i}`];
          data[`sd_${pair.left}_${pair.right}`] =
            val !== undefined && val !== "" ? Number(val) : null;
        });

        if (isAudio) {
          data.naturalness = res.naturalness ? Number(res.naturalness) : null;
        }
        data.bio1 = res.bio1 ?? null;
        data.bio2 = Object.keys(res)
          .filter(key => key.startsWith("bio2_"))
          .map(key => res[key])
          .join("|");
      },
    };
  });
}
