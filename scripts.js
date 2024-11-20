const form = document.getElementById("dataForm");
const requiredFields = Array.from(form.querySelectorAll("input[required], select[required]"));
const idCodeField = document.getElementById("idCode");
const formSets = document.querySelectorAll("fieldset");

const progressDisplay = document.getElementById("progress");
const progressDisplayTrack = document.getElementById("track-fill");
const paginationButtons = [document.querySelector("#prev"), document.querySelector("#next")];
let currentPage = 0;

let duomenys = {};
const fields = form.querySelectorAll("input, select");
for(let field of fields) {
    duomenys[field.name] = field.value;
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
        return value !== "" && value !== "+370" && value !== "Pagrindinis";
    });
    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    progressDisplay.textContent = progress;
    progressDisplayTrack.style.width = progress + "%";

    if(progress == 100) progressDisplayTrack.classList.add("green");
    duomenys[inputField.target.name] = inputField.target.value;
}

function updateIdCode() {
    const birthDate = document.getElementById("birthDate").value;
    if (birthDate) {
        const date = new Date(birthDate);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        idCodeField.value = `X${year}${month}${day}XXXX`;
        duomenys["idCode"] = `X${year}${month}${day}XXXX`;
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Forma sėkmingai pateikta!");
    console.table(duomenys);
});