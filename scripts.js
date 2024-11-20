const form = document.getElementById("dataForm");
const requiredFields = Array.from(form.querySelectorAll(".required"));
const idCodeField = document.getElementById("idCode");
const formSets = document.querySelectorAll("fieldset");

const progressDisplay = document.getElementById("progress");
const progressDisplayTrack = document.getElementById("track-fill");
const paginationButtons = [document.querySelector("#prev"), document.querySelector("#next")];
let currentPage = 0;

let duomenys = {};
const fields = form.querySelectorAll("input, select");
for(let field of fields) {
    duomenys[field.name] = {value: field.value, required: field.classList.contains("required")};
}
console.table(duomenys);

form.addEventListener("input", (inputField) => dataUpdate(inputField));
document.getElementById("birthDate").addEventListener("change", updateIdCode);

paginationButtons[0].addEventListener("click", () => {
    if (currentPage - 1 >= 0) {
        currentPage--;
        formSwitch(currentPage);
    }
})

paginationButtons[1].addEventListener("click", () => {
    if (currentPage + 1 < formSets.length) {
        currentPage++;
        formSwitch(currentPage);
    }
})

function formSwitch(currentPage) {
    const nextUp = document.querySelector("#nextUp").firstElementChild;
    for(let formSet of formSets) {
        formSet.classList.add("hidden");
    }
    formSets[currentPage].classList.remove("hidden");

    try {
        nextUp.innerHTML = formSets[currentPage+1].firstElementChild.innerHTML;
    } catch(e) {
        nextUp.innerHTML = "Apklausos pabaiga. Spauskite 'Pateikti'"
    }

    
    if(currentPage == formSets.length - 1) {
        paginationButtons[1].classList.add("hidden")
        paginationButtons[0].classList.remove("hidden")
    } else if (currentPage == 0){
        paginationButtons[0].classList.add("hidden")
        paginationButtons[1].classList.remove("hidden")
    } else {
        paginationButtons[0].classList.remove("hidden")
        paginationButtons[1].classList.remove("hidden")
    }

}

function dataUpdate(inputField) {
    const filledFields = requiredFields.filter(field => {
        const value = field.value.trim();
        return value !== "" && value !== "+370";
    });
    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    progressDisplay.textContent = progress;
    progressDisplayTrack.style.width = progress + "%";

    if(progress == 100) progressDisplayTrack.classList.add("green");
    duomenys[inputField.target.name] = {value: inputField.target.value, required: inputField.target.classList.contains("required")};
}

function updateIdCode() {
    const birthDate = document.getElementById("birthDate").value;
    if (birthDate) {
        const date = new Date(birthDate);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        idCodeField.value = `X${year}${month}${day}XXXX`;
        duomenys["idCode"] = {value: `X${year}${month}${day}XXXX`, required: true};
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let msg = "";
    for(let field of requiredFields) {
        let value = field.value.trim();
        if(value === "" || value === "+370") {
           msg += form.querySelector(`label[for="${field.name}"]`).innerHTML.replace(":", "") + "\n";
        }
    }
    if(msg != "") {
        msg += "\nNeužpildėte šių laukų!"
        alert(msg);
        console.table(duomenys);
        return;
    }
    // try fetch(medtod: "post")...
    alert("Forma sėkmingai pateikta!");
    console.table(duomenys);
});