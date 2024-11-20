const form = document.getElementById("dataForm");
let requiredFields;
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

function showAndHideOptional(field) {
    console.log(field.name, field.value)
    function showOptionalField(fieldId) {
        form.querySelector(`#${fieldId}`).classList.add("show")
        try {
            form.querySelector(`#${fieldId} > input`).classList.add("required");
        } catch {
            form.querySelector(`#${fieldId} > select`).classList.add("required");
        }
    }

    function hideOthers(dependacyName) {
        form.querySelectorAll(`[data-link="${dependacyName}"]`).forEach((el) => {
            el.classList.remove("show");
            el.querySelector("input, select").classList.remove("required");
        });
    }

    if(field.name === "education") {
        hideOthers("education");
        showOptionalField("lastSchool");
        showOptionalField("graduationYear");
        if(field.value == "profesinis") {
            showOptionalField("qualification");
        } if (field.value == "aukštasis-kolegijinis"
            || field.value == "aukštasis-universitetinis") {
                showOptionalField("degreeType");
                showOptionalField("qualification");
        }
    } else if(field.name == "birthDate") {
        hideOthers("birthDate");
        const birthDate = new Date(field.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if(age >= 16) {
            showOptionalField("maritalStatus");
        }
    } else if(field.name == "maritalStatus") {
        hideOthers("maritalStatus");
        if(field.value == "maried") {
            showOptionalField("spouse");
        }
    } else if(field.name == "work") {
        hideOthers("work");
        if(field.value == "studying") {
            showOptionalField("studyType");
            showOptionalField("studyYear");
            showOptionalField("studyPlace");
            showOptionalField("studyFinishDate");
        } else if(field.value == "employed") {
            showOptionalField("workPlace");
            showOptionalField("workPosition");
        } else if(field.value == "unemployed") {
            showOptionalField("unemployedReason");
        } else if(field.value == "parentalleave") {
            showOptionalField("parentalLeaveEndDate");
        }
    }
}

function dataUpdate(inputField) {
    showAndHideOptional(inputField.target);
    requiredFields = Array.from(form.querySelectorAll(".required"));
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
    
    //Įvairi formos duomenų "validacija". pvz.:
    msg = "";
    if(duomenys["idCode"].length !== 11 /*ir t.t.*/) {
        msg += "Asmens kodo formatas neteisingas!";
    }
    //if...

    if(msg != "") {
        alert(msg);
        return;
    }
    
    // try fetch(medtod: "post")... catch... return;
    alert("Forma sėkmingai pateikta!");

    console.table(duomenys);
});