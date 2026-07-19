// ページが開いたら実行
document.addEventListener("DOMContentLoaded", async () => {

    const select = document.getElementById("lottery");

    try {
        // lotteries.json を読み込む
        const response = await fetch("data/lotteries.json");
        const lotteries = await response.json();

        // 今ある選択肢を削除
        select.innerHTML = "";

        // JSONから選択肢を作る
        lotteries.forEach(lottery => {
            const option = document.createElement("option");

            option.value = lottery.id;
            option.textContent = lottery.name;

            select.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        alert("宝くじ一覧を読み込めませんでした。");
    }

});

const button = document.getElementById("checkButton");

button.addEventListener("click", async () => {

    const lotteryId = document.getElementById("lottery").value;

    const response = await fetch(`data/${lotteryId}.json`);
    const lotteryData = await response.json();

    document.getElementById("result").textContent =
        `${lotteryData.name} を読み込みました`;

});