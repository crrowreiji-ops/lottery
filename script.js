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
    const result = document.getElementById("result");

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

    function checkPrize(ticket, prize) {

    switch (prize.type) {

        // 組も番号も一致（1等）
        case "exact":
            return (
                ticket.group === prize.group &&
                ticket.number === prize.number
            );


        // 前後賞
        case "adjacent":
            if (ticket.group !== prize.group) {
                return false;
            }

            const target = Number(prize.number);
            const number = Number(ticket.number);

            return (
                number === target - 1 ||
                number === target + 1
            );


        // 組違い賞
        case "same_number":
            return ticket.number === prize.number;


        // 番号だけ一致
        case "exact_number":
            return ticket.number === prize.number;


        // 下〇桁
        case "suffix":
            return ticket.number.slice(-prize.digits) === prize.number;


        default:
            return false;
    }
}

if (!ticket) {
        resultText += `${number} → 番号形式エラー\n`;
        return;
    }


    let hit = false;


    for (const prize of lotteryData.prizes) {

        if (checkPrize(ticket, prize)) {

            resultText +=
                `${number} → ${prize.name} ${prize.money.toLocaleString()}円\n`;

            hit = true;
            break;
        }

    }


    if (!hit) {
        resultText += `${number} → はずれ\n`;
    }

});


result.textContent = resultText;
});
});