function parseLotteryNumber(text) {

    const match = text.match(/(\d+)組(\d+)/);

    if (!match) {
        return null;
    }

    return {
        group: match[1],
        number: match[2]
    };
}

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


let resultText = `${lotteryData.name}\n\n`;


numbers.forEach(number => {

    const ticket = parseLotteryNumber(number);

    if (!ticket) {
        resultText += `${number} → 番号形式エラー\n`;
        return;
    }


    const firstPrize = lotteryData.prizes[0];


    if (
        ticket.group === firstPrize.group &&
        ticket.number === firstPrize.number
    ) {
        resultText += `${number} → ${firstPrize.name} ${firstPrize.money.toLocaleString()}円\n`;
    } else {
        resultText += `${number} → はずれ\n`;
    }

});


result.textContent = resultText;
});
});