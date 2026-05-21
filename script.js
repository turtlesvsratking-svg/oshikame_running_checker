document.addEventListener('DOMContentLoaded', () => {
    const diagnoseBtn = document.getElementById('diagnoseBtn');
    const backBtn = document.getElementById('backBtn');
    
    if (diagnoseBtn) diagnoseBtn.addEventListener('click', diagnose);
    if (backBtn) backBtn.addEventListener('click', showInputPage);

    renderHistory();
});

function diagnose() {
    const criticalChecks = document.querySelectorAll('.critical-check:checked');
    const cautionChecks = document.querySelectorAll('.caution-check:checked');
    
    const inputPage = document.getElementById('inputPage');
    const resultPage = document.getElementById('resultPage');
    const resultTitle = document.getElementById('resultTitle');
    const resultImage = document.getElementById('resultImage');
    const resultMessage = document.getElementById('resultMessage');

    let shouldStop = false;

    // 1つでも絶対条件があるか、累積が3つ以上で「休息」
    if (criticalChecks.length > 0 || cautionChecks.length >= 3) {
        shouldStop = true;
    }

    // 入力した日の【次の日の日付】を計算（5/21の夜に入力したら5/22を生成）
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`;

    // 画面の切り替え（全画面風に大きく表示）
    inputPage.style.display = 'none';
    resultPage.style.display = 'block';

    let logText = "";

    if (shouldStop) {
        logText = "走っちゃダメ";
        resultTitle.style.color = "var(--danger-color)";
        resultTitle.innerText = "明日は【 休息 】です";
        resultImage.src = "IMG_4274.png"; // 休養用の画像
        
        // 罪悪感を完全に打ち消す徹底承認＆効果メッセージ
        resultMessage.innerHTML = `
            <p style="font-size: 1.1rem; font-weight: bold; color: var(--danger-color); margin-bottom: 8px;">✨ ナイス判断！素晴らしい自己管理です ✨</p>
            <p>今夜「休む」と決断できたあなたを、全力でリスペクトします！これはサボりではなく、次に強く速く走るための<strong>『積極的超回復メニュー』</strong>の開始です。</p>
            <p style="margin-top: 10px; font-size: 0.9rem; color: #555;">💡 <strong>休むことの科学的効果:</strong><br>睡眠中に筋肉の微細な傷が修復され、心肺の疲労が抜けることで、次回走る時のフォームが安定し、故障リスクを劇的に下げることができます。</p>
        `;
    } else {
        logText = "走ってOK！";
        resultTitle.style.color = "var(--success-color)";
        resultTitle.innerText = "明日は【 走ってOK 】です";
        resultImage.src = "IMG_4275.png"; // 出撃OK用の画像
        
        resultMessage.innerHTML = `
            <p style="font-size: 1.1rem; font-weight: bold; color: var(--success-color); margin-bottom: 8px;">👍 コンディション良好です！</p>
            <p>心身ともに走る準備が整っています。明日の朝は、無理のない快適なペースで気持ちよく風を感じてきてくださいね！</p>
        `;
    }

    // 「〇/〇は走っちゃダメ」の形式でローカルストレージへ保存
    const storageData = `${dateStr}は${logText}`;
    saveLog(storageData);
    renderHistory();
    window.scrollTo(0, 0);
}

function showInputPage() {
    document.getElementById('resultPage').style.display = 'none';
    document.getElementById('inputPage').style.display = 'block';
    
    // チェックボックスをすべてリセット
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    window.scrollTo(0, 0);
}

// ローカルストレージへの単純保存（直近5日分）
function saveLog(logEntry) {
    let history = JSON.parse(localStorage.getItem('runCheckerSimpleHistory')) || [];
    history.unshift(logEntry);
    if (history.length > 5) history.pop();
    localStorage.setItem('runCheckerSimpleHistory', JSON.stringify(history));
}

// 履歴の描画
function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const history = JSON.parse(localStorage.getItem('runCheckerSimpleHistory')) || [];
    if (history.length === 0) {
        historyList.innerHTML = "<li style='color:#888;'>まだ判定記録はありません</li>";
        return;
    }
    
    historyList.innerHTML = history.map(item => {
        // 文字列に「走ってOK！」が含まれているかで色を変える
        const isOk = item.includes("走ってOK！");
        const color = isOk ? "var(--success-color)" : "var(--danger-color)";
        return `<li style="color: ${color}; font-weight: 500;">${item}</li>`;
    }).join('');
}
