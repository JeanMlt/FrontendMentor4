

function calculateValues(mortgageAmount, mortgageTerm, interestRate){
    const totalPayment = Number(mortgageAmount)*(1+Number(interestRate)/100)
    const monthlyPayment = totalPayment/(12 * Number(mortgageTerm))
    const monthlyInterests = monthlyPayment - Number(mortgageAmount) / 12 / Number(mortgageTerm)
    return {totalPayment:totalPayment.toFixed(2), monthlyPayment:monthlyPayment.toFixed(2), monthlyInterests:monthlyInterests.toFixed(2)}
}

async function displayResultSection(element, results, mortgageType, displayResults, resultsTemplatePath, emptyResultsPath) {
    console.log(results)
    if (displayResults === true) {
        try {
            const response = await fetch(resultsTemplatePath)
            if (!response.ok) throw new Error('Failed to load template');
            let html = await response.text();
            amount = mortgageType === "repayment" ? results.monthlyPayment : results.monthlyInterests;
            html = html
                .replace('{{totalRepayment}}', results.totalPayment)
                .replace('{{amount}}', amount)
            element.innerHTML = html
        }

        catch (error) {
            console.log(error)
        }
    }
    else {
        try {
            const response = await fetch(emptyResultsPath)
            if (!response.ok) throw new Error('Failed to load template');
            let html = await response.text();
            element.innerHTML = html
        }

        catch (error) {
            console.log(error)
        }
    }
}


function toggleInputRequiredMessage(element, isDisplayed){
    errorMessage = element.querySelector(".error-message")
    if(isDisplayed){
        if(errorMessage === null){
        const msg = document.createElement('p');
        msg.textContent = 'This field is required';
        msg.className = 'error-message';
        element.appendChild(msg);
        }
    }
    else if(errorMessage && !isDisplayed)errorMessage.remove()
}

function changeInputColor(element, isDisplayed){
    spanElement = element.querySelector("span")
    inputStyleElement = element.querySelector(".input-style")
    if(isDisplayed){
        inputStyleElement.style.borderColor = "red"
    spanElement.style.color = "white"
    spanElement.style.backgroundColor = "red"
    }
    else{
    inputStyleElement.style.borderColor = "var(--color-dark-blue)"
    spanElement.style.color = "var(--color-dark-blue)"
    spanElement.style.backgroundColor = "var(--color-light-blue)"
    }
    
}


document.getElementById("clear-button").addEventListener('click',()=>{
    document.querySelectorAll('.input-group').forEach(e=>{
        changeInputColor(e, false)
        toggleInputRequiredMessage(e,false)
        let input = e.querySelector(".input-required")
        input.value = ""
        
    })
    const mortgageTypeElement = document.querySelector('.input-group-mortgage')
    toggleInputRequiredMessage(mortgageTypeElement, false)

    document.querySelectorAll(".radio-option").forEach((radioDiv) => {
        const radioInput = radioDiv.querySelector('input[type="radio"]');
            radioInput.checked = false;
            const changeEvent = new Event('change', {
                bubbles: true,
                cancelable: true
            });
            radioInput.dispatchEvent(changeEvent);
        });

        displayResultSection(document.querySelector("#results-section"), null, null, false,"html/results.html","html/emptyResults.html")
   
});


document.getElementById("calculate-button").addEventListener('click',()=>{
    let mortgageValues = []
    let res
    let mortgageTypeValue
    let displayResults = false
    const inputsElements = document.querySelectorAll('.input-required')
    const mortgageTypeElement = document.querySelector('.input-group-mortgage')
    const mortgageType = document.querySelector('input[name="mortgage-type"]:checked')
    const resultBox = document.querySelector("#results-section")

    inputsElements.forEach((ie)=>{
        let inputDiv = document.querySelector(`#${ie.id}-group`)
        if(ie.value <= 0 || ie.value === NaN){
            toggleInputRequiredMessage(inputDiv,true)
            changeInputColor(inputDiv, true)
        }
        else {
            toggleInputRequiredMessage(inputDiv,false)
            changeInputColor(inputDiv, false)
            mortgageValues.push(ie.value)
        }
    });

    if(mortgageType === null)toggleInputRequiredMessage(mortgageTypeElement, true)
    else {
        toggleInputRequiredMessage(mortgageTypeElement, false)
        mortgageValues.push(mortgageType);
        mortgageTypeValue = mortgageType.value
    }
    
    if(mortgageValues.length === 4){
        res = calculateValues(...mortgageValues)
        displayResults = true
    }

    displayResultSection(resultBox, res, mortgageTypeValue, displayResults,"html/results.html","html/emptyResults.html")
});


document.querySelectorAll(".radio-option").forEach((radioDiv) => {
    const radioInput = radioDiv.querySelector('input[type="radio"]');
    radioDiv.addEventListener('click', (e) => {
        radioInput.checked = true;
        const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        radioInput.dispatchEvent(changeEvent);
    });

    const label = radioDiv.querySelector('label');
        if (label) {
            label.addEventListener('click', (e) => {
                e.preventDefault(); // Prevents automatic triggering of radio input
            });
        }
    
    radioInput.addEventListener('change', () => {
        const name = radioInput.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
            input.parentElement.parentElement.classList.remove('selected');
        });
        if (radioInput.checked) {
            radioDiv.classList.add('selected');
        }
    });
}, );