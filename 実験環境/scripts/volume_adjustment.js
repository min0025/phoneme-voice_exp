// 参加者が本試行前に音量を合わせるための画面です。
const volume_adjustment = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <h1>音量の調節</h1><br>
    <p style="font-size: 20px">ここでは、ご自身で音量調節を行ってもらいます。再生ボタンを押すと音声が流れます。</p>
    <p style="font-size: 20px"><U><b>「イヤホン」または「ヘッドホン」は装着したままで音声を聞き、可能であれば「有線」のものをご使用ください。</b></U></p>
    <p style="font-size: 20px"><U><b>また、パソコンのサウンド環境は「モノラル」ではなく「ステレオ」に設定してください。</b></U></p>
    <p style="font-size: 20px; margin-bottom: 35px"><u>音声は何回でも再生可能です</u>。</p>
    <div style="text-align: center; margin-bottom: 30px;">
      <button type="button" id="volumePlayBtn">再生</button>
      <audio id="volumeAudio" src="${experiment_config.volumeAudioPath}"></audio>
    </div>
    <p style="font-size: 18px;">音量調節が終わったら「次へ」を押してください。</p>
  `,
  choices: ["次へ"],
  // 再生後だけ次へ進めるようにボタン状態を制御します。
  on_load: function(){
    const playBtn = document.getElementById("volumePlayBtn");
    const audio = document.getElementById("volumeAudio");
    const nextBtn =
      document.querySelector("#jspsych-html-button-response-button-0 button") ||
      document.querySelector("#jspsych-html-button-response-button-0");
    const volumeAudioFile = new URL(experiment_config.volumeAudioPath, window.location.href).href;

    if (!playBtn || !audio || !nextBtn) return;

    nextBtn.disabled = true;
    playBtn.disabled = true;
    playBtn.textContent = "読み込み中...";

    fetch(volumeAudioFile, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to preload ${volumeAudioFile}: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        audio.src = URL.createObjectURL(blob);
        audio.load();
        playBtn.disabled = false;
        playBtn.textContent = "再生";
      })
      .catch((error) => {
        console.error("Volume adjustment preload failed:", volumeAudioFile, error);
        playBtn.disabled = false;
        playBtn.textContent = "再生";
      });

    playBtn.addEventListener("click", function(){
      nextBtn.disabled = true;
      playBtn.disabled = true;
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error("Volume adjustment playback failed:", volumeAudioFile, error);
        playBtn.disabled = false;
        playBtn.textContent = "再生";
      });
    });

    audio.addEventListener("play", function(){
      playBtn.textContent = "再生中...";
    });

    audio.addEventListener("ended", function(){
      nextBtn.disabled = false;
      playBtn.disabled = false;
      playBtn.textContent = "もう一度再生";
    });

    audio.addEventListener("pause", function(){
      if (!audio.ended) {
        playBtn.disabled = false;
        playBtn.textContent = "再生";
      }
    });
  }
};
