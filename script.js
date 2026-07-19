document.addEventListener("DOMContentLoaded", async () => {

    const select = document.getElementById("lottery");
    const button = document.getElementById("checkButton");

    const response = await fetch("data/lotteries.json");
    const lotteries = await response.json();

    select.innerHTML = "";

    lotteries.forEach(lottery => {
        const option = document.createElement("option");
        option.value = lottery.id;
        option.textContent = lottery.name;
        select.appendChild(option);
    });


button.addEventListener("click", async () => {

    console.log("ボタン押された");

    const lotteryId = select.value;

    console.log("選択:", lotteryId);


    const response = await fetch(`data/${lotteryId}.json`);

    const lotteryData = await response.json();


    // 入力された番号を取得
    const input = document.getElementById("numbers").value;


    // 改行で分割
    const numbers = input.split("\n");


    console.log(numbers);


    result.textContent =
        `${lotteryData.name} を読み込みました\n\n` +
        "入力された番号:\n" +
        numbers.join("\n");

});
});