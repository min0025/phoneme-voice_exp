// 3音を連結した6通りの音声と、最も小さい音の位置です。
const scr_stimuli = [
  ["quiet_normal_anti", 1],
  ["quiet_anti_normal", 1],
  ["normal_quiet_anti", 2],
  ["normal_anti_quiet", 3],
  ["anti_quiet_normal", 2],
  ["anti_normal_quiet", 3],
].map(([order, quiet_position]) => ({
  quiet_position,
  file: new URL(`./assets/screening/screening_${order}.wav`, window.location.href).href,
}));

// スクリーニング連結音声のプリロード結果を保持します。
let preloaded_scr_stimuli = null;

// ヘッドホン装着を確認する6問のスクリーニング本体です。
const screening_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <h1>実験前の確認</h1><br>
    <p style="font-size: 20px"><B><U>必ず「ヘッドホン」または「イヤホン」を装着し、可能であれば「有線」のものをご使用ください</U></B></p>
    <p style="font-size: 20px"><B><U>また、パソコンのサウンド環境は「モノラル」ではなく「ステレオ」に設定してください</U></B></p>
    <p style="font-size: 20px">再生ボタンを押すと、3つの音が順番に再生されます</p>
    <p style="font-size: 20px">3つの音の中で<b><u>最も小さく聞こえた音</u></b>について、<U><b>その音が何番目に流れたか</b></U>を選択してください</p>
    <p style="font-size: 20px; margin-bottom: 40px">この試行は${scr_stimuli.length}回行われます。</p>
    <hr>
    <div id="controls"></div>
    <audio id="screeningAudio" preload="auto"></audio>
    <br>
    <button id="nextBtn" disabled>次へ</button>
  `,

  choices: [],
  // 音声の連続再生と回答UIの切り替えをまとめて管理します。
  on_load() {
    let current = 0;
    const answers = [];
    const sequence_order = jsPsych.randomization.shuffle([...scr_stimuli]);

    const container = document.getElementById("controls"); // 何回目の音声再生か
    const screeningAudio = document.getElementById("screeningAudio"); // スクリーニング再生に使うaudio要素
    const nextBtn = document.getElementById("nextBtn"); // 次へボタンの要素

    // 連結済みスクリーニング音声を先に取得して再生ラグを減らします。
    async function preloadScreeningFiles(){
      if (preloaded_scr_stimuli) {
        return preloaded_scr_stimuli;
      }

      preloaded_scr_stimuli = await Promise.all(
        scr_stimuli.map(async (stim) => {
          const response = await fetch(stim.file, { cache: "force-cache" });
          if (!response.ok) {
            throw new Error(`Failed to preload ${stim.file}: ${response.status}`);
          }

          const blob = await response.blob();
          return {
            ...stim,
            loaded_file: URL.createObjectURL(blob),
          };
        })
      );

      return preloaded_scr_stimuli;
    }

    // 単一の連結音声ファイルを1回再生します。
    function playScreeningFile(file){
      return new Promise((resolve, reject) => {
        const cleanup = () => {
          screeningAudio.removeEventListener("ended", handleEnded);
          screeningAudio.removeEventListener("error", handleError);
        };

        const handleEnded = () => {
          cleanup();
          resolve();
        };

        const handleError = () => {
          cleanup();
          reject(new Error(`Failed to play ${file}`));
        };

        screeningAudio.pause();
        screeningAudio.currentTime = 0;
        screeningAudio.src = file;
        screeningAudio.load();
        screeningAudio.addEventListener("ended", handleEnded);
        screeningAudio.addEventListener("error", handleError);

        screeningAudio.play().catch((error) => {
          cleanup();
          reject(error);
        });
      });
    }

    function render() {
      const sequence = sequence_order[current];

      container.innerHTML = `
        <p style="font-size: 24px; margin-top: 30px;">${current + 1} / ${sequence_order.length} 試行目</p>

        <div style="margin-top:40px; margin-bottom:20px;">
          <label><input type="radio" name="ans" value="1" disabled>1番目</label>
          <label><input type="radio" name="ans" value="2" disabled>2番目</label>
          <label><input type="radio" name="ans" value="3" disabled>3番目</label>
        </div>

        <br>
        <button id="playBtn">再生</button>
        <button id="decideBtn" disabled>決定</button>
      `;

      const playBtn = document.getElementById("playBtn"); // 音声再生ボタンの状態取得
      const decideBtn = document.getElementById("decideBtn"); // 決定ボタンの状態取得
      const radios = document.querySelectorAll('input[name="ans"]'); // ラジオボタンの状態取得

      let selected = null;

      playBtn.onclick = () => {
        // 再生中は操作不可
        playBtn.disabled = true;
        playBtn.textContent = "再生中...";
        decideBtn.disabled = true;
        radios.forEach(r => r.disabled = true);

        playScreeningFile(sequence.loaded_file || sequence.file)
          .then(() => {
            playBtn.textContent = "再生済み";
            radios.forEach(r => r.disabled = false);
          })
          .catch((error) => {
            console.error("Screening audio playback failed:", sequence.file, error);
            alert("音声の再生に失敗しました。通信状況やファイル配置を確認して、もう一度お試しください。");
            playBtn.disabled = false;
            playBtn.textContent = "再生";
          });
      };

      radios.forEach(r => {
        r.onchange = () => {
          selected = parseInt(r.value); // 選択された値を記録
          decideBtn.disabled = false; // 決定ボタンを有効化
        };
      });

      decideBtn.onclick = () => {
        if (selected === null) return;
        answers[current] = selected;
        if (current < sequence_order.length - 1) {
          current++;
          render();
          return;
        }

        decideBtn.disabled = true;
        playBtn.disabled = true;
        radios.forEach(r => r.disabled = true);
        nextBtn.disabled = false;
      };
    }
    container.innerHTML = `<p style="font-size: 20px; margin-top: 30px;">音声を読み込んでいます。しばらくお待ちください。</p>`;

    preloadScreeningFiles()
      .then((loadedStimuli) => {
        for (let i = 0; i < sequence_order.length; i++) {
          const matched = loadedStimuli.find(
            (stim) => stim.file === sequence_order[i].file
          );
          if (matched) {
            sequence_order[i] = matched;
          }
        }

        render();
      })
      .catch((error) => {
        console.error("Screening preload failed:", error);
        container.innerHTML =
          `<p style="font-size: 20px; margin-top: 30px;">音声の読み込みに失敗しました。ページを再読み込みして、もう一度お試しください。</p>`;
      });

    nextBtn.onclick = () => {
      const correct_count = answers.filter((answer, index) => answer === sequence_order[index].quiet_position).length;
      const pass = correct_count >= 5;

      jsPsych.finishTrial({
        correct_count,
        pass,
        screening_score: correct_count,
        screening_pass: pass
      });
    };
  }
};

// スクリーニング失敗時の再確認画面
// スクリーニング失敗時に装着状況を確認してもらう画面です。
const screening_retry_notice = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <h1>装着状況の再確認</h1><br>
    <p style="font-size: 20px"><b><u>「イヤホン」または「ヘッドホン」を装着した上で聴取していますか？ 可能であれば「有線」のものをご使用ください。</u></b></p>
    <p style="font-size: 20px"><b><u>パソコンのサウンド環境が「モノラル」ではなく「ステレオ」になっていることもご確認ください。</u></b></p>
    <p style="font-size: 20px">必ず設定を確認した上で参加してください。</p>
    <p style="font-size: 20px">最初からやり直します。</p>
  `,
  choices: ["最初から"]
};

// 直前の結果が不合格だった場合だけ再確認画面を表示します。
const screening_retry_block = {
  timeline: [screening_retry_notice],
  conditional_function: function(){
    const last_trial = jsPsych.data.get().last(1).values()[0];
    return last_trial && last_trial.pass === false;
  }
};

// スクリーニング全体構成
// 合格するまでスクリーニング本体を繰り返す全体ブロックです。
const screening = {
  timeline: [screening_trial, screening_retry_block],
  loop_function: function(data){
    const screening_data = data.values().find(trial => Object.prototype.hasOwnProperty.call(trial, "pass"));
    return screening_data && screening_data.pass === false;
  }
};

// 最後の試行の合否と得点を実験全体のデータに付与します。
const record_screening_result = {
  type: jsPsychCallFunction,
  func: function(){
    const data = jsPsych.data.get().filterCustom(function(trial){
      return Object.prototype.hasOwnProperty.call(trial, "screening_pass");
    }).last(1).values()[0];

    jsPsych.data.addProperties({
      screening_pass: data.screening_pass,
      screening_score: data.screening_score
    });
  }
};
