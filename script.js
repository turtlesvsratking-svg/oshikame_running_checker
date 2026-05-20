document.addEventListener('DOMContentLoaded', () => {
    const diagnoseBtn = document.getElementById('diagnoseBtn');
    if (diagnoseBtn) {
        diagnoseBtn.addEventListener('click', diagnose);
    }
});

function diagnose() {
    const criticalChecks = document.querySelectorAll('.critical-check:checked');
    const cautionChecks = document.querySelectorAll('.caution-check:checked');
    
    const resultArea = document.getElementById('resultArea');
    const resultTitle = document.getElementById('resultTitle');
    const resultComment = document.getElementById('resultComment');

    let shouldStop = false;
    let mainReason = "";

    // 判定ロジック（一発休養 or 累積3項目以上）
    if (criticalChecks.length > 0) {
        shouldStop = true;
        mainReason = `「${criticalChecks[0].value}」などの絶対条件に該当しています。`;
    } else if (cautionChecks.length >= 3) {
        shouldStop = true;
        mainReason = `累積条件（疲労や違和感）が ${cautionChecks.length} つ重なっています。`;
    }

    // 結果コンテナの可視化
    resultArea.style.display = 'block';

    if (shouldStop) {
        resultArea.className = "result-modal status-stop";
        resultTitle.innerText = "🚨 明日の朝は【絶対休戦】です";
        resultComment.innerHTML = `
            <strong>理由: ${mainReason}</strong><br><br>
            いつも頑張るあなたへ。明日の朝はアラームを少し遅らせて、睡眠と回復に時間を使いましょう。勇気を持って休むことも、長期的に楽しく走り続けるための大切な練習メニューです🐢
        `;
    } else {
        resultArea.className = "result-modal status-go";
        resultTitle.innerText = "🏃‍♂️ 明日の朝は【出撃OK】！";
        
        let advice = "心身のコンディションは良好です。";
        if (cautionChecks.length > 0) {
            advice += `<br><br>※ただし、軽度の疲労サイン（${cautionChecks.length}項目）があります。明日の朝はペースを落として、身体を労わるのんびりラン（LSDなど）がおすすめです。`;
        } else {
            advice += "<br><br>気持ちよく汗を流して、素晴らしい一日のスタートを切りましょう！";
        }
        resultComment.innerHTML = advice;
    }

    // 視覚的UXを高めるためのスムーズスクロール
    resultArea.scrollIntoView({ behavior: 'smooth' });
}
