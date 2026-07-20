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


function checkPrize(ticket, prize) {

    switch (prize.type) {

        case "exact":
            return (
                ticket.group === prize.group &&
                ticket.number === prize.number
            );

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

        case "same_number":
            return ticket.number === prize.number;

        case "exact_number":
            return ticket.number === prize.number;

        case "suffix":
            return ticket.number.slice(-prize.digits) === prize.number;

        default:
            return false;
    }
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

const addButton = document.getElementById("addButton");
const tickets = document.getElementById("tickets");

let count = 0;


function updateTicketNumbers() {
   const ticketList = document.querySelectorAll(".ticket");

    ticketList.forEach((ticket, index) => {

        ticket.querySelector(".ticket-title").textContent =
            `${index + 1}枚目`;

    });

    count = ticketList.length;
}

function createTicket(group = "", number = "") {

    count++;

    const div = document.createElement("div");

    div.className = "ticket";

    div.innerHTML = `
        <p class="ticket-title">${count}枚目</p>

        <div class="ticket-inputs">

            <input class="group"
    type="text"
    value="${group}"
    placeholder="01"
    maxlength="2"
    inputmode="numeric">

<input class="number"
    type="text"
    value="${number}"
    placeholder="111111"
    maxlength="6"
    inputmode="numeric">

            <button class="deleteButton">
                <span class="material-symbols-outlined">
                    delete
                </span>
            </button>

        </div>
    `;

    div.querySelector(".deleteButton").addEventListener("click", () => {

        div.remove();

        updateTicketNumbers();

    });

    tickets.appendChild(div);

}

createTicket();

const serialButton = document.getElementById("serialButton");

serialButton.addEventListener("click", () => {

    const group = document.getElementById("serialGroup").value;
    const start = Number(document.getElementById("serialStart").value);
    const ticketCount = Number(document.getElementById("serialCount").value);

    if (!group || isNaN(start) || isNaN(count) || count <= 0) {
        alert("入力内容を確認してください");
        return;
    }

    for (let i = 0; i < ticketCount; i++) {

        createTicket(
            group.padStart(2, "0"),
            String(start + i).padStart(6, "0")
        );

    }

});

addButton.addEventListener("click", () => {

    createTicket();

});

button.addEventListener("click", async () => {

    console.log("ボタン押された");

    const lotteryId = select.value;

    console.log("選択:", lotteryId);


    const response = await fetch(`data/${lotteryId}.json`);

    const lotteryData = await response.json();


    // 入力された番号を取得
const groups = document.querySelectorAll(".group");
const numbersInput = document.querySelectorAll(".number");


const numbers = [];


for(let i = 0; i < groups.length; i++){

    if (
        groups[i].value === "" ||
        numbersInput[i].value === ""
    ) {
        continue;
    }

    numbers.push(
        `${groups[i].value}組${numbersInput[i].value}`
    );

}


let resultHtml = `<h3>${lotteryData.name}</h3>`;
let totalPrize = 0;


numbers.forEach((number, index) => {

    const ticket = parseLotteryNumber(number);


if (!ticket) {
        resultHtml += `${number} → 番号形式エラー\n`;
        return;
    }


    let hit = false;


    for (const prize of lotteryData.prizes) {

        if (checkPrize(ticket, prize)) {

            resultHtml += `
<div class="result-row">
    <span>${index + 1}枚目：${number}</span>
    <span class="hit">
        ${prize.name}（${prize.money.toLocaleString()}円）
    </span>
</div>
`;
                totalPrize += prize.money;

            hit = true;
            break;
        }

    }


    if (!hit) {
        resultHtml += `
<div class="result-row">
    <span>${index + 1}枚目：${number}</span>
    <span class="miss">はずれ</span>
</div>
`;
    }

});

// チケットの金額をここで定義
const ticketPrice = 300;
const totalCost = numbers.length * ticketPrice;
const profit = totalPrize - totalCost;

resultHtml += `
<div class="summary">

    <h3>当選金額合計</h3>
    <p>${totalPrize.toLocaleString()}円</p>

    <h3>購入金額</h3>
    <p>${totalCost.toLocaleString()}円</p>

    <h3>損益</h3>
    <p>${profit >= 0 ? "+" : ""}${profit.toLocaleString()}円</p>

</div>
`;

result.innerHTML = resultHtml;
});
});