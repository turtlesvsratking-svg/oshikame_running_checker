document.addEventListener('DOMContentLoaded', () => {
    const diagnoseBtn = document.getElementById('diagnoseBtn');
    const backBtn = document.getElementById('backBtn');
    
    if (diagnoseBtn) diagnoseBtn.addEventListener('click', diagnose);
    if (backBtn) backBtn.addEventListener('click', showInputPage);

    // 起動時にローカルストレージから履歴を読み込んで描画
    renderHistory();
});

function diagnose() {
    const criticalChecks = document.querySelectorAll('.critical-check:checked');
    const cautionChecks = document.querySelectorAll('.caution-check:checked');
    
    const inputPage = document.getElementById('inputPage');
    const resultPage = document.getElementById('resultPage');
    const resultTitle = document.getElementById('resultTitle');
    const resultImage = document.getElementById('resultImage');
    const resultComment = document.getElementById('resultComment');
    const praiseMessage = document.getElementById('praiseMessage');

    let shouldStop = false;
    let reasonText = "";

    if (criticalChecks.length > 0) {
        shouldStop = true;
        reasonText = `絶対条件（${criticalChecks[0].value}など）の検出`;
    } else if (cautionChecks.length >= 3) {
        shouldStop = true;
        reasonText = `累積条件が${cautionChecks.length}つ重複`;
    }

    // 画面切り替え（フォームを非表示にし、結果を大きく表示）
    inputPage.style.display = 'none';
    resultPage.style.display = 'block';

    const today = new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
    let statusLog = "";

    if (shouldStop) {
        statusLog = "絶対休養";
        resultTitle.style.color = "var(--danger-color)";
        resultTitle.innerText = "明日の朝は絶対休戦です";
        resultImage.src = "IMG_4274.png"; // プリロード済みのため瞬時に表示
        
        resultComment.innerHTML = `<strong>理由: ${reasonText}</strong><br>心身が危険信号を出しています。明日のランニングはスケジュールから完全に除外してください。`;
        
        // 罪悪感解消・徹底承認ロジック
        praiseMessage.style.display = "block";
        praiseMessage.innerHTML = `
            <h4>【承認】あなたの選択は100点満点です</h4>
            <p>ここで休めるのは、自分の身体を客観的に管理できている素晴らしい証拠であり、一流の自己管理能力です。サボりではなく「超回復」という極めて重要な練習メニューを今、消化しています。</p>
            <p style="margin-top: 8px;"><strong>休むことの効果:</strong> 筋肉の微細な損傷が修復され、心肺機能の疲労が抜けることで、次回走る際の大幅なパフォーマンス向上と怪我の予防が約束されます。</p>
        `;
    } else {
        statusLog = "出撃OK";
        resultTitle.style.color = "var(--success-color)";
        resultTitle.innerText = "明日の朝は出撃OKです";
        resultImage.src = "IMG_4275.png";
        praiseMessage.style.display = "none";
        
        if (cautionChecks.length > 0) {
            resultComment.innerHTML = `疲労サインが${cautionChecks.length}つあります。ペースを抑えてのんびり走るのがおすすめです。`;
        } else {
            resultComment.innerHTML = "コンディションは良好です。体調に合わせて走ってください。";
        }
    }

    // ローカルストレージへ保存
    saveLog(today, statusLog);
    renderHistory();
    window.scrollTo(0, 0);
}

function showInputPage() {
    document.getElementById('resultPage').style.display = 'none';
    document.getElementById('inputPage').style.display = 'block';
    window.scrollTo(0, 0);
}

// ローカルストレージ保存処理
function saveLog(date, status) {
    let history = JSON.parse(localStorage.getItem('runCheckerHistory')) || [];
    // 直近5件を維持
    history.unshift({ date, status });
    if (history.length > 5) history.pop();
    localStorage.setItem('runCheckerHistory', JSON.stringify(history));
}

// 履歴の描画処理
function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const history = JSON.parse(localStorage.getItem('runCheckerHistory')) || [];
    if (history.length === 0) {
        historyList.innerHTML = "<li style='color:#888;'>まだ履歴はありません</li>";
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <li>
            <span>${item.date}</span>
            <span style="font-weight:bold; color:${item.status === '絶対休養' ? 'var(--danger-color)' : 'var(--success-color)'}">${item.status}</span>
        </li>
    `).join('');
}
