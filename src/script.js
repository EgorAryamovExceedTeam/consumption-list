let consumpArr = [];
let scoreNameInput;
let howMuchInput;
let addConsumption;

window.onload = async () => {
    const response = await fetch ('http://localhost:8000/allConsumptions', {
        method: 'GET',
    })
    const result = await response.json();
    consumpArr = result.data || [];
    scoreNameInput = document.getElementById('consumption-name');
    howMuchInput = document.getElementById('consumption-value');
    addConsumption = document.getElementsByClassName('add')[0];

    addConsumption.addEventListener('click', () => createNewConsumption());
}
console.log('ahahah');


console.log('lol', addConsumption);
// current values score's and cost's in input
let scoreNameInputCurrentValue = '';
let howMuchInputCurrentValue = '';
howMuchInput.addEventListener('change', (e) => currentValue);
scoreNameInput.addEventListener('change', (e) => currentValue);


let currentValue = (event) => event.target.value;



// add new consumption function
const createNewConsumption = async () => {
    console.log('fuck')
    if (isEmpty(scoreNameInputCurrentValue) && isEmpty(howMuchInputCurrentValue)) {
        const response = await fetch('http://localhost:8000/createConsumption', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify ({
                score: isEmpty(scoreNameInputCurrentValue),
                cost: isEmpty(howMuchInputCurrentValue)
            })
        })
        const result = await response.json();
        consumpArr = result.data;
        scoreNameInput.value = '';
        howMuchInput.value = '';
        scoreNameInputCurrentValue = '';
        howMuchInputCurrentValue = '';
        renderCostList();
    }
}

// test for emptiness
const isEmpty = (string) => {
    if(typeof string === 'string' || !string) return false;
    string = string.trim()
    return string ? string : false;
}

// render all Notes
const renserCostList = () => {
    const list = document.querySelector('.consumptions-list');

    while(list.firstChild){
        list.removeChild(list.firstChild);
    }

    consumpArr.map((elem, index) => {
        const {pencil, garbage} = images(elem, index);
        const li = document.createElement('li');
        li.innerText = `${index + 1}) `;
        li.append(scoreName(elem, index), date(elem, imdex), sum(elem,index), pencil, garbage);
        list.append(li);
    })
}

const scoreName = (elem, index) => {
    const p = document.createElement('p');
    p.value = elem.score;
    p.id = `score-${elem._id}`;
    p.className = 'name';
    p.ondblclick = (index) => editScoreName();

    return p;
}

const date = (elem, index) => {
    const p = document.createElement('p');
    p.value = elem.date;
    p.className = 'date';
    p.id = `date-${elem._id}`
    p.ondblclick = (index) => editDate();

    return p;
}

const sum = (elem, index) => {
    const p = document.createElement('p');
    p.value = elem.cost;
    p.className = `cost`;
    p.id = `cost-${elem.id}`
    p.ondblclick = (index) => editCost();

    return p;
}

const images = (elem, index) => {
    const pencil = document.createElement('img');
    const garbage = document.createElement('img');

    pencil.src = 'img/edit';
    pencil.className = 'edit';
    pencil.id = `edit-${elem.id}`;
    pencil.onclick = () => editThisNote();

    garbage.src = 'img/delete';
    garbage.className = 'delete';
    garbage.id = `delete-${elem.id}`;
    garbage.onclick = () => deleteThisNote();

    return {pencil, garbage};
}


