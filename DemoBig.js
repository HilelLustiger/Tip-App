
if (window.innerWidth > 780) {

    // -------------------------- Head UI elements --------------------------
    const infoBoxHoursText = document.querySelector("#infoBoxHoursText");
    const infoBoxWageText = document.querySelector("#infoBoxWageText");
    const infoBoxMoneyText = document.querySelector("#infoBoxMoneyText");
    const infoBoxRestText = document.querySelector("#infoBoxRestText");
    const infoBoxShiftText = document.querySelector("#infoBoxShiftText");

    // -------------------------- Waiter UI elements --------------------------
    const WaiterForm = document.querySelector("#waiterForm");
    const AddBtn = document.querySelector("#AddBtn");

    // -------------------------- Money UI elements --------------------------

    const plusButtons = document.querySelectorAll(".incBtn");
    const minButtons = document.querySelectorAll(".decBtn");

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

    const CreateWaiter = function (Name, Hours, WaiterType) {
        let NewWaiter = {
            Name: `${Name}`,
            Hours: Hours,
            WaiterType: `${WaiterType}`,
            balance: 0,
            wallet: [0, 0, 0, 0, 0, 0, 0, 0]
        }
        return NewWaiter;
    }

    const OpenWaiterForm = function () {
        WaiterForm.style.display = "block";
        let listDisplay = document.querySelector("#listDisplay");
        listDisplay.style.display = "none";

        // //declaring the button and function for closing the form.
        const CancelWaiterBtn = document.querySelector("#CancelWaiterBtn");
        const CloseWaiterForm = function () {
            WaiterForm.style.display = "none";

        }
        CancelWaiterBtn.addEventListener("click", CloseWaiterForm);

        //submiting the form and creating new list item
        WaiterForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let NewWaiterName = document.querySelector("#NameInput").value;
            let NewWaiterHours = parseFloat(document.querySelector("#HoursInput").value);
            let NewWaiterType = document.querySelector("#WaiterType").value;
            document.querySelector("#NameInput").value = "";
            document.querySelector("#HoursInput").value = "";

            // Creating new waiter if the input is valid
            if (NewWaiterName !== "" && NewWaiterHours !== "") {

                uploadListItem(NewWaiterName, NewWaiterHours, NewWaiterType);
                let NewWaiter = CreateWaiter(NewWaiterName, NewWaiterHours, NewWaiterType);
                waiters.push(NewWaiter);

                infoBoxes.hours = infoBoxes.hours + NewWaiterHours;

            }
            updateBoxes();
            CloseWaiterForm();
            listDisplay.style.display = "inline";
        });
    }

    for (let i = 0; i < plusButtons.length; i++) {
        plusButtons[i].addEventListener('click', function (event) {
            // updating the counter display
            let btnClicked = event.target;
            let number = btnClicked.parentElement.children[1];
            let inputValue = parseFloat(number.innerText);
            let newValue = inputValue + 1;
            number.innerText = newValue

            // updating the cashier
            cashier[i] += 1;

            // updating the info display
            infoBoxes.money = infoBoxes.money + currency[i];
            updateBoxes();
        })

    }

    for (let i = 0; i < minButtons.length; i++) {
        minButtons[i].addEventListener('click', function (event) {
            // updating the counter display
            let btnClicked = event.target;
            let number = btnClicked.parentElement.children[1];
            let inputValue = parseFloat(number.innerText);
            let newValue = inputValue - 1;

            if (cashier[i] === 0) {
                alert("cant have negative number of coins");
            }
            else {
                number.innerText = newValue
                // updating the cashier
                cashier[i] -= 1;
                // updating the info display
                // B -= currency[i];
                infoBoxes.money = infoBoxes.money - currency[i];
            }
            updateBoxes();
        })

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


    AddBtn.addEventListener("click", OpenWaiterForm);


}

