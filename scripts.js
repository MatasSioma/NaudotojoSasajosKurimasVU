const form = document.getElementById("dataForm");
const progressDisplay = document.getElementById("progress");
const progressDisplayTrack = document.getElementById("track-fill");
const idCodeField = document.getElementById("idCode");

const formSets = document.querySelectorAll("fieldset");
const paginationButtons = [document.querySelector("#prev"), document.querySelector("#next")];
let currentPage = 0;

form.addEventListener("input", () => updateProgress());

document.getElementById("birthDate").addEventListener("change", () => updateIdCode());

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
        nextUp.innerHTML = "Apklausos pabaiga."
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

function updateProgress() {
    const fields = Array.from(form.querySelectorAll("input, select"));
    const filledFields = fields.filter(field => field.value.trim() !== "");
    const progress = Math.round((filledFields.length / fields.length) * 100);
    progressDisplay.textContent = progress;
    progressDisplayTrack.style.width = progress + "%";
    if(progress == 100) {
        progressDisplayTrack.classList.add("green");

    }
}

function updateIdCode() {
    const birthDate = document.getElementById("birthDate").value;
    if (birthDate) {
        const date = new Date(birthDate);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        idCodeField.value = `X${year}${month}${day}XXXX`; 
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Forma sėkmingai pateikta!");
});