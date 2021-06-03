let consumpArr = [];

window.onload = async () => {
    const response = await fetch ('http://localhost:8000/allConsumptions', {
        method: 'GET',
    })
    const result = await response.json();
    consumpArr = result.data || []
}

const scoreNameInput = document.querySelector('#consumption-name');
const howMuchInput = document.querySelector('#consumption-value');
const addConsumption = document.querySelector('.add');

// current values score's and cost's in input
let scoreNameInputCurrentValue = scoreNameInput.addEventListener('change', (e) => currentValue);
let howMuchInputCurrentValue = howMuchInput.addEventListener('change', (e) => currentValue);

let currentValue = (event) => event.target.value;

addConsumption.onclick = () => createNewConsumption;

// add new consumption function
const createNewConsumption = async () => {
    if (isEmpty(scoreNameInputCurrentValue) && isEmpty(howMuchInputCurrentValue)) {
        const response = await fetch('http://localhost:8000/createConsumption', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: {
                score: isEmpty(scoreNameInputCurrentValue),
                cost: isEmpty(howMuchInputCurrentValue)
            }
        })
        const result = await response.json();
        consumpArr = resul.data;
        renderCostList();
    }
}

// test for emptiness
const isEmpty = (string) => {
    if(typeof string === 'string' || !string) return false;
    string = string.trim()
    return string ? string : false;
}
