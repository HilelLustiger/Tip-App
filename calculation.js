
const List = document.querySelector("#list");
let waiters = [];
let currency = [1, 2, 5, 10, 20, 50, 100, 200];
let cashier = [0, 0, 0, 0, 0, 0, 0, 0];
let weekend = false;
let infoBoxes = {
    hours: 0,
    wage: 0,
    money: 0,
    rest: 0,
    shift: 0
}
const updateBoxes = function () {
    infoBoxes.wage = 0;

    let restPrec;
    weekend ? restPrec = 11 : restPrec = 8
    infoBoxes.rest = Math.floor(infoBoxes.hours * restPrec);

    let sum = infoBoxes.money - infoBoxes.rest;
    infoBoxes.shift = Math.floor(sum * 0.06);
    sum = sum - infoBoxes.shift;

    if (infoBoxes.hours !== 0) {
        infoBoxes.wage = Math.floor(sum / infoBoxes.hours);
    }

    infoBoxHoursText.innerText = `${infoBoxes.hours}`;
    infoBoxWageText.innerText = `${infoBoxes.wage}`;
    infoBoxMoneyText.innerText = `${infoBoxes.money}`;
    infoBoxRestText.innerText = `${infoBoxes.rest}`;
    infoBoxShiftText.innerText = `${infoBoxes.shift}`;
}

const get_balance = function (arr) {
    let output = 0;
    for (let i = 0; i < arr.length; i++) {
        output = output + (arr[i] * currency[i]);
    }
    return output;
}

const money_missing = function (arr) {
    for (let waiter of arr) {
        if (waiter.WaiterType == "Runner") {
            waiter.balance = - waiter.Hours * 45;
        } else {
            waiter.balance = - waiter.Hours * infoBoxes.wage;
        }
    }
}

const balance_sort = function (from, to, arr) {
    for (let i = to; i >= from; i--) {
        for (let j = i - 1; j >= from; j--) {
            let temp = arr[i];
            if (arr[i].balance < arr[j].balance) {
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
}

const distribution = function (start, end, arr, arrCashier) {
    for (let i = 7; i >= 0; i--) { // A loop for the different coins types
        for (let j = start; j <= end && arrCashier[i] > 0; j++) { // A loop for the waiters
            while (arr[j].balance + currency[i] <= 0 & arrCashier[i] > 0) {
                arr[j].balance += currency[i];
                arr[j].wallet[i] += 1;
                arrCashier[i] -= 1;
            }
        }
    }
}

const second_distribution = function (start, end, arr, arrCashier) {
    for (let i = 7; i >= 0; i--) { // A loop for the different coins types
        for (let j = start; j <= end && arrCashier[i] > 0; j++) { // A loop for the waiters
            while (arr[j].balance + currency[i] < currency[i] & arrCashier[i] > 0) {
                arr[j].balance += currency[i];
                arr[j].wallet[i] += 1;
                arrCashier[i] -= 1;
            }
        }
    }
}

const find_best_change = function (currency_index, arr) { //returns the waiter with the best change
    output = null;
    let money_to_change = currency[currency_index];
    let waiter_index = 1;
    best_change = [0, 0, 0, 0, 0, 0, 0, 0];
    let best_sum = 0;

    while (waiter_index < waiters.length && waiters[waiter_index].balance < 0) { //for all the waiters in minus)
        let temp_change = [0, 0, 0, 0, 0, 0, 0, 0];
        let temp_sum = 0;
        for (let i = currency_index - 1; i >= 0; i--) {
            let currency_amount = arr[waiter_index].wallet[i];
            while (currency_amount > 0 & money_to_change > temp_sum) { 				// while the waiter has the coin and its not more then the wanted amount
                temp_change[i]++;
                temp_sum = temp_sum + currency[i];
                currency_amount = currency_amount - 1;
            }
        }
        if (temp_sum > best_sum) {
            best_change = temp_change;
            best_sum = temp_sum;
            output = waiters[waiter_index];
        }
        waiter_index++;
    }
    return output;
}

const find_change = function (arr) {
    let currency_to_change = 7;
    let output = null;
    while (currency_to_change >= 0 & cashier[currency_to_change] == 0) {
        currency_to_change = currency_to_change - 1;
    }

    if (currency_to_change != 0) {
        output = find_best_change(currency_to_change, arr);
    }
    return output;
}

const take_change = function (to_take_from, arrCashier) {
    let currency_to_change = 7;
    while (currency_to_change >= 0 && arrCashier[currency_to_change] == 0) {
        currency_to_change = currency_to_change - 1;
    }
    let sum_to_change = currency[currency_to_change];
    //give the big coin to the waiter
    to_take_from.balance += currency[currency_to_change];
    to_take_from.wallet[currency_to_change] += 1;
    arrCashier[currency_to_change] -= 1;

    let i = currency_to_change - 1;
    //takes the change from the waiter

    while (i >= 0 && sum_to_change - currency[i] > 0) {

        while (to_take_from.wallet[i] > 0) {

            sum_to_change = sum_to_change - currency[i];
            to_take_from.balance -= currency[i];
            to_take_from.wallet[i] -= 1;
            arrCashier[i] += 1;
        }
        i--;
    }
}

const algorithm = function (arrays) {
    distribution(arrays.newWaiters.length - 1, arrays.newWaiters.length - 1, arrays.newWaiters, arrays.newCashier);
    if (arrays.newWaiters[arrays.newWaiters.length - 1].balance != 0) {
        alert("Not enough small change for the resturant");
        return null;
    }
    balance_sort(0, arrays.newWaiters.length - 2, arrays.newWaiters);
    distribution(0, arrays.newWaiters.length - 2, arrays.newWaiters, arrays.newCashier);
    balance_sort(0, arrays.newWaiters.length - 2, arrays.newWaiters);
    for (let i = 0; i < 2; i++) {
        let to_change = find_change(arrays.newWaiters);
        if (to_change != null) {
            take_change(to_change, newCashier);
        }
    }
    balance_sort(1, arrays.newWaiters.length - 1, arrays.newWaiters);
    second_distribution(0, arrays.newWaiters.length - 1, arrays.newWaiters, arrays.newCashier);
    return arrays;
}

const isMoreThenMinimum = function (cashier) {
    let minWage;
    weekend ? minWage = 45 : minWage = 33;
    return (infoBoxes.wage > minWage);
}

const makeCopies = function (orgWaiters, orgCashier) {
    let output = { newWaiters: [], newCashier: [] };
    for (let i = 0; i < orgWaiters.length; i++) {
        output.newWaiters[i] = orgWaiters[i];
    }
    for (let i = 0; i < orgCashier.length; i++) {
        output.newCashier[i] = orgCashier[i];
    }
    return output;
}

const makeList = function (arr) {
    let Shift = CreateWaiter("Shift", 0, "");
    Shift.balance = -infoBoxes.shift;
    arr.push(Shift);
    uploadListItem("Shift", 0, "");

    let Rest = CreateWaiter("Rest", 0, "");
    Rest.balance = -infoBoxes.rest;
    arr.push(Rest);
    uploadListItem("Rest", 0, "");
}

let CreateWaiter = function (Name, Hours, WaiterType) {
    let NewWaiter = {
        Name: `${Name}`,
        Hours: Hours,
        WaiterType: `${WaiterType}`,
        balance: 0,
        wallet: [0, 0, 0, 0, 0, 0, 0, 0]
    }
    return NewWaiter;
}

let uploadListItem = function (Name, Hours, Type) {
    //create listItem
    let NewWaiterItem = document.createElement('div');
    List.appendChild(NewWaiterItem);

    //creating list title
    let NewWaiterTitle = document.createElement('div');
    NewWaiterTitle.classList.add("listTitle");
    NewWaiterTitle.classList.add("rounded");

    NewWaiterItem.appendChild(NewWaiterTitle);

    let ItemName = document.createElement('span');
    ItemName.innerText = Name;
    ItemName.classList.add("WaitersNames");
    NewWaiterTitle.appendChild(ItemName);

    let description = document.createElement('span');
    if (Name === "Shift" || Name === "Rest") {
        description.innerText = "";
    } else if (Name === "Extras") {
        description.innerText = "What's left in the jar";

    } else {
        description.innerText = ` ${Hours} hours`;
    }
    NewWaiterTitle.appendChild(description);

    if (Type == "Runner") {
        let runner = document.createElement('span');
        runner.innerText = "Runner";
        runner.classList.add("badge");
        NewWaiterTitle.appendChild(runner);
    }

    //create coin details

    let NewWaiterInfo = document.createElement('div');
    NewWaiterInfo.classList.add("coinsDetails");
    NewWaiterItem.appendChild(NewWaiterInfo);

    for (let i = 0; i < 8; i++) {
        let coinContainer = document.createElement('div');
        coinContainer.classList.add("coinContainer");
        NewWaiterInfo.appendChild(coinContainer);

        let img = document.createElement('img');
        img.src = "cash.png";
        coinContainer.appendChild(img);

        let coin = document.createElement('span');
        coin.innerText = currency[i];
        coinContainer.appendChild(coin);

        let num = document.createElement('p');
        num.innerText = "0";
        coinContainer.appendChild(num);
    }
    NewWaiterInfo.style.display = "none";


    description.addEventListener('click', function (event) {
        let btnClicked = event.target;
        let info = btnClicked.parentElement.parentElement.children[1];

        if (info.style.display == "none") {
            info.style.display = "flex";
        } else {
            info.style.display = "none";
        }
    })

    ItemName.addEventListener('click', function (event) {
        let btnClicked = event.target;
        let info = btnClicked.parentElement.parentElement.children[1];

        if (info.style.display == "none") {
            info.style.display = "flex";
        } else {
            info.style.display = "none";
        }
    })

}

const Calculation = function () {
    let copies = makeCopies(waiters, cashier);
    money_missing(copies.newWaiters);
    makeList(copies.newWaiters);
    let minimum = isMoreThenMinimum(copies.newCashier);
    if (!minimum) {
        copies.newWaiters[copies.newWaiters.length - 1].balance = 0;
    }
    let output = algorithm(copies);
    if (output !== null) {
        updateWaiterInfo(output.newWaiters, minimum);
        createExtras(output.newCashier);
    }
    return output;
}

const updateWaiterInfo = function (arr, boolean) {
    let walletDisplays = document.querySelectorAll(".WaitersNames");
    for (let i = 0; i < arr.length; i++) {
        // update the wallet display
        let targetName = walletDisplays[i].innerText;
        let currInfo = walletDisplays[i].parentElement.parentElement.children[1];
        let currWaiter = arr.find((element) => element.Name === targetName);
        for (let j = 0; j < 8; j++) { //for every coin
            currInfo.children[j].children[2].innerText = currWaiter.wallet[j];
        }

        // update the info in the title
        let got = get_balance(arr[i].wallet);
        let wantedWage;

        if (targetName === "Rest") {
            wantedWage = infoBoxes.rest;
            if (!boolean) {
                walletDisplays[i].parentElement.children[1].innerText = "There is not enough for the resturant tax";
            } else if (got - wantedWage === 0) {
                walletDisplays[i].parentElement.children[1].innerText = ` should have ${wantedWage}, got ${wantedWage} `;
            } else if (got - wantedWage > 0) {
                walletDisplays[i].parentElement.children[1].innerText = ` should have ${wantedWage}, got ${got - wantedWage} extra`;
            } else {
                walletDisplays[i].parentElement.children[1].innerText = ` should have ${wantedWage}, missing ${wantedWage - got}`;
            }
        } else if (targetName === "Shift") {
            wantedWage = infoBoxes.shift;
            if (got - wantedWage === 0) {
                walletDisplays[i].parentElement.children[1].innerText = ` should have ${wantedWage}, got ${wantedWage} `;
            } else if (got - wantedWage > 0) {
                walletDisplays[i].parentElement.children[1].innerText = ` should have ${wantedWage}, got ${got - wantedWage} extra`;
            } else {
                walletDisplays[i].parentElement.children[1].innerText = ` should have ${wantedWage}, missing ${wantedWage - got}`;
            }
        } else {
            wantedWage = arr[i].Hours * infoBoxes.wage
            let should = `should have ${arr[i].Hours} X ${infoBoxes.wage} = ${wantedWage}`;
            if (got - wantedWage === 0) {
                walletDisplays[i].parentElement.children[1].innerText = `${should}, got ${wantedWage} `;
            } else if (got - wantedWage > 0) {
                walletDisplays[i].parentElement.children[1].innerText = `${should}, got ${got - wantedWage} extra`;
            } else {
                walletDisplays[i].parentElement.children[1].innerText = `${should}, missing ${wantedWage - got}`;
            }
        }

    }
}

const createExtras = function (arr) {
    if (get_balance(arr) > 0) {
        uploadListItem("Extras", 0, "");
        let walletDisplays = document.querySelectorAll(".WaitersNames");
        // update the wallet display
        let currWaiter = walletDisplays[waiters.length + 2];
        let currInfo = currWaiter.parentElement.parentElement.children[1];

        for (let j = 0; j < 8; j++) { //for every coin
            currInfo.children[j].children[2].innerText = `${arr[j]}`;
        }
    }
}

const changeWeek = function () {
    if (weekend) {
        weekendBtn.innerText = "MidWeek"
        weekend = false;
    } else {
        weekendBtn.innerText = "WeekEnd";
        weekend = true;
    }
    updateBoxes();

}

const calBtn = document.querySelector("#calBtn");
calBtn.addEventListener("click", Calculation);

const weekendBtn = document.querySelector("#weekendBtn");
weekendBtn.addEventListener("click", changeWeek);


