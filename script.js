document.addEventListener("DOMContentLoaded", () => {
    const formSteps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progress");
    const steps = document.querySelectorAll(".step");

    let formData = JSON.parse(localStorage.getItem("formData")) || {
        fullName: "",
        dob: "",
        gender: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipcode: ""
    };

    let currentStep = parseInt(localStorage.getItem("currentStep")) || 1;
    populateFormFields();
    goToStep(currentStep);

    function populateFormFields() {
        Object.keys(formData).forEach(key => {
            const field = document.getElementById(key);
            if (field) field.value = formData[key];
        });
        
        const genderRadio = document.querySelector(`input[name="gender"][value="${formData.gender}"]`);
        if (genderRadio) genderRadio.checked = true;
        
        updateSummary();
    }

    function updateProgress(step) {
        const progressWidth = ((step - 1) / (steps.length - 1)) * 100;
        progressBar.style.width = `${progressWidth}%`;
        steps.forEach((stepEl, idx) => {
            stepEl.classList.toggle("active", idx < step);
            stepEl.classList.toggle("completed", idx < step - 1);
        });
    }

    function goToStep(step) {
        formSteps.forEach((formStep, idx) => {
            formStep.classList.toggle("active", idx === step - 1);
        });
        currentStep = step;
        updateProgress(step);
        localStorage.setItem("currentStep", step);
    }

    function validateStep1() {
        return validateFields(["fullName", "dob"]) && validateGender();
    }

    function validateStep2() {
        return validateFields(["email", "phone", "address", "city", "zipcode"]);
    }

    function validateFields(fields) {
        let isValid = true;
        fields.forEach(field => {
            const input = document.getElementById(field);
            const errorElement = document.getElementById(`${field}-error`);
            if (input.value.trim() === "" || (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) ||
                (field === "phone" && !/^\d{10,15}$/.test(input.value.replace(/[- )(]/g, ""))) ||
                (field === "zipcode" && !/^\d{5,10}$/.test(input.value))) {
                input.classList.add("error");
                errorElement.classList.add("visible");
                isValid = false;
            } else {
                input.classList.remove("error");
                errorElement.classList.remove("visible");
                formData[field] = input.value.trim();
            }
        });
        localStorage.setItem("formData", JSON.stringify(formData));
        return isValid;
    }

    function validateGender() {
        const gender = document.querySelector("input[name='gender']:checked");
        const genderError = document.getElementById("gender-error");
        if (!gender) {
            genderError.classList.add("visible");
            return false;
        } else {
            genderError.classList.remove("visible");
            formData.gender = gender.value;
            localStorage.setItem("formData", JSON.stringify(formData));
            return true;
        }
    }

    function updateSummary() {
        ["fullName", "dob", "gender", "email", "phone", "address", "city", "zipcode"].forEach(key => {
            document.getElementById(`summary-${key}`).textContent = formData[key] || "-";
        });
    }

    document.getElementById("next-1").addEventListener("click", () => {
        if (validateStep1()) goToStep(2);
    });

    document.getElementById("prev-2").addEventListener("click", () => goToStep(1));

    document.getElementById("next-2").addEventListener("click", () => {
        if (validateStep2()) {
            updateSummary();
            goToStep(3);
        }
    });

    document.getElementById("prev-3").addEventListener("click", () => goToStep(2));

    document.getElementById("edit-step-1").addEventListener("click", () => goToStep(1));
    document.getElementById("edit-step-2").addEventListener("click", () => goToStep(2));

    document.getElementById("submit-form").addEventListener("click", () => {
        document.getElementById("alert").style.display = "block";
        console.log("Form submitted:", formData);
        setTimeout(() => {
            localStorage.clear();
        }, 2000);
    });

    document.querySelectorAll(".form-control").forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("error");
            document.getElementById(`${input.id}-error`).classList.remove("visible");
        });
    });

    document.querySelectorAll("input[type='radio']").forEach(radio => {
        radio.addEventListener("change", () => {
            document.getElementById("gender-error").classList.remove("visible");
        });
    });
});
