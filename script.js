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
    const resultImage = document.getElementById('resultImage');
    const resultComment = document.getElementById('resultComment');

    let shouldStop = false;
    let reasonText = "";

    // 判定ロジック
    if (criticalChecks.length > 0) {
        shouldStop = true;
        reasonText = `絶対条件（${criticalChecks[0].value}など）に該当しています。`;
    } else if (cautionChecks.length >= 3) {
        shouldStop = true;
        reasonText = `累積条件が${cautionChecks.length}つ重なっています。`;
    }

    // 表示エリアを可視化
    resultArea.style.display = 'block';

    if (shouldStop) {
        resultArea.className = "result-modal status-stop";
        resultTitle.innerText = "明日の朝は絶対休戦です";
        resultImage.src = "IMG_4274.png";
        resultComment.innerHTML = `<strong>理由: ${reasonText}</strong><br>アラームを消してゆっくり休んでください。`;
    } else {
        resultArea.className = "result-modal status-go";
        resultTitle.innerText = "明日の朝は出撃OKです";
        resultImage.src = "IMG_4275.png";
        
        if (cautionChecks.length > 0) {
            resultComment.innerHTML = `疲労サインが${cautionChecks.length}つあります。ペースを抑えてのんびり走るのがおすすめです。`;
        } else {
            resultComment.innerHTML = "コンディションは良好です。体調に合わせて走ってください。";
        }
    }

    // 診断結果へスムーズにスクロール
    resultArea.scrollIntoView({ behavior: 'smooth' });
}
