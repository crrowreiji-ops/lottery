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

        const lotteryId = select.value;

        const response = await fetch(`data/${lotteryId}.json`);
        const lotteryData = await response.json();

        document.getElementById("result").textContent =
            `${lotteryData.name} を読み込みました`;

    });

});