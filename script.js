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

    let shouldStop = false;

    // 判定境界値のロジック（絶対条件が1以上、または累積条件が3以上で休息）
    if (criticalChecks.length > 0 || cautionChecks.length >= 3) {
        shouldStop = true;
    }

    // 入力した日をベースに「翌日（実際に走る日）」の日付オブジェクトを生成
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`;

    // 画面を一気に切り替え
    inputPage.style.display = 'none';
    resultPage.style.display = 'block';

    let logStatus = "";

    if (shouldStop) {
        logStatus = "休息";
        resultTitle.style.color = "var(--danger-color)";
        resultTitle.innerText = "明日は【 休息 】";
        resultImage.src = "IMG_4274.png"; // 事前ロード済みのため瞬時描画
    } else {
        logStatus = "走ってOK";
        resultTitle.style.color = "var(--success-color)";
        resultTitle.innerText = "明日は【 走ってOK 】";
        resultImage.src = "IMG_4275.png";
    }

    // 次の日の日付を主軸にしたテキスト表現でストレージへコミット
    const logId = Date.now(); // 個別削除キー用のタイムスタンプ
    saveLog(logId, dateStr, logStatus);
    renderHistory();
    window.scrollTo(0, 0);
}

function showInputPage() {
    document.getElementById('resultPage').style.display = 'none';
    document.getElementById('inputPage').style.display = 'block';
    
    // 次回利用のためにチェックをすべて初期化
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    window.scrollTo(0, 0);
}

// タイムスタンプ付与によるローカルストレージオブジェクト保存
function saveLog(id, date, status) {
    let history = JSON.parse(localStorage.getItem('runCheckerCardHistory')) || [];
    history.unshift({ id, date, status });
    if (history.length > 5) history.pop(); // 表示上限を直近5件に絞る
    localStorage.setItem('runCheckerCardHistory', JSON.stringify(history));
}

// 特定カードのインライン削除ロジック
function deleteLog(id) {
    let history = JSON.parse(localStorage.getItem('runCheckerCardHistory')) || [];
    history = history.filter(item => item.id !== id);
    localStorage.setItem('runCheckerCardHistory', JSON.stringify(history));
    renderHistory();
}

// 履歴をカードUI（グリッド）として動的レンダリング
function renderHistory() {
    const historyGrid = document.getElementById('historyGrid');
    if (!historyGrid) return;
    
    const history = JSON.parse(localStorage.getItem('runCheckerCardHistory')) || [];
    if (history.length === 0) {
        historyGrid.innerHTML = "<p style='color:#888; font-size:0.85rem; text-align:center; padding:10px;'>まだ判定記録はありません</p>";
        return;
    }
    
    historyGrid.innerHTML = history.map(item => {
        const isStop = item.status === "休息";
        const statusClass = isStop ? "stop" : "go";
        const statusText = isStop ? "走っちゃダメ" : "走ってOK！";
        
        return `
            <div class="history-card">
                <div class="card-info">
                    <span class="card-date">${item.date} のスケジュール</span>
                    <span class="card-status ${statusClass}">${statusText}</span>
                </div>
                <button type="button" class="btn-delete" onclick="deleteLog(${item.id})" title="この記録を削除">
                    🗑️
                </button>
            </div>
        `;
    }).join('');
}
