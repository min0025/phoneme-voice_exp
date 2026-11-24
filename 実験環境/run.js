// タイムライン生成
const timeline = [];

timeline.push(consent_form, gap); // 同意書を入れる

// クラウドワークス作業者ID
if (experiment_config.collectWorkerId) {
  timeline.push(worker_id_form, gap);
}

// スクリーニング
if (experiment_config.enableScreening) {
  timeline.push(screening, gap);
}

// 音量調整
timeline.push(volume_adjustment, gap);

// スクリーニングの結果データを付与
if (experiment_config.enableScreening) {
  timeline.push({
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
  }, gap);
}

// 本実験へ進む
timeline.push(...main_experiment());

// 本実験結果を保存し終了
timeline.push(save_data, thanks);

jsPsych.run(timeline); // タイムラインを実行する
