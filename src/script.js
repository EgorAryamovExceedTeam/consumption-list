let consumpArr = [];
let scoreNameInput = document.getElementById("consumption-name");
let howMuchInput = document.getElementById("consumption-value");
let addConsumption = document.getElementById("add");
let totalSum = document.getElementById("total");

window.onload = async () => {
  const response = await fetch("http://localhost:8000/allConsumptions", {
    method: "GET",
  });
  const result = await response.json();
  consumpArr = result.data || [];
  renderTotalSum();
  renderCostList();
};

// current values score's and cost's in input
let scoreNameInputCurrentValue = "";
let howMuchInputCurrentValue = "";

howMuchInput.addEventListener("change", (e) => {
  howMuchInputCurrentValue = e.target.value;
});
scoreNameInput.addEventListener("change", (e) => {
  scoreNameInputCurrentValue = e.target.value;
});

// add new consumption function
const createNewNote = async () => {
  if (scoreNameInputCurrentValue && howMuchInputCurrentValue) {
    if (Number(howMuchInputCurrentValue)) {
      const response = await fetch("http://localhost:8000/createConsumption", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          score: scoreNameInputCurrentValue,
          cost: howMuchInputCurrentValue,
        }),
      });
      const result = await response.json();
      consumpArr = result.data;
      scoreNameInput.value = "";
      howMuchInput.value = "";
      scoreNameInputCurrentValue = "";
      howMuchInputCurrentValue = "";
      renderTotalSum();
      renderCostList();
    }
  }
};

// render sum of all cost
const renderTotalSum = () => {
  let sum = 0;
  if (consumpArr.length) {
    consumpArr.forEach((elem) => {
      sum += Number(elem.cost);
    });
  }
  totalSum.innerText = `Итого ${sum} p.`;
};

// render all Notes
const renderCostList = () => {
  const list = document.querySelector(".consumptions-list");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  consumpArr.map((elem, index) => {
    const { pencil, garbage } = images(elem, index);
    const li = document.createElement("li");
    li.id =`li-${elem._id}`;
    li.innerText = `${index + 1}) `;
    li.append(
      scoreName(elem, index),
      date(elem, index),
      sum(elem, index),
      pencil,
      garbage
    );
    list.append(li);
  });
};

// below are the elements for drawing the note
////////////////////////////////////////////////////////////////////

// create Score Name
const scoreName = (elem, index) => {
  const p = document.createElement("p");
  p.innerText = `Магазин "${elem.score}"`;
  p.id = `score-${elem._id}`;
  p.className = "name";
  p.ondblclick = () => editScoreName(elem, index, p);

  return p;
};

// create date of note
const date = (elem, index) => {
  const p = document.createElement("p");
  p.innerText = elem.date;
  p.className = "date";
  p.id = `date-${elem._id}`;
  p.ondblclick = () => editDate(index, p);

  return p;
};

// create sum of cost
const sum = (elem, index) => {
  const p = document.createElement("p");
  p.innerText = `${elem.cost} p.`;
  p.className = `cost`;
  p.id = `cost-${elem._id}`;
  p.ondblclick = () => editCost(index, p);

  return p;
};

// create edit and delete buttons
const images = (elem, index) => {
  const pencil = document.createElement("img");
  const garbage = document.createElement("img");

  pencil.src = "img/edit.svg";
  pencil.className = "edit";
  pencil.id = `edit-${elem._id}`;
  pencil.onclick = () => editThisNote(index);

  garbage.src = "img/delete.svg";
  garbage.className = "delete";
  garbage.id = `delete-${elem._id}`;
  garbage.onclick = () => deleteThisNote(index);

  return { pencil, garbage };
};
///////////////////////////////////////////////////////////////////

// edit Name of Score
const editScoreName = (element, index, scoreNameElem) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = `${element.score}`

    const li = document.getElementById(`li-${element._id}`);
    scoreNameElem = li.replaceChild(input, scoreNameElem);

    input.focus();
    
    input.onblur = () => saveOrDelete(input, li, element, scoreNameElem);
}

const deleteThisNote = async (elem) => {
    const response = await fetch(`http://localhost:8000/deleteConsumption?_id=${elem._id}`, {
            method: 'DELETE',
        })
        const result = await response.json();
        consumpArr = result.data;
        renderCostList();
}

const saveOrDelete = async (input, li, elem, scoreNameElem) => {
    const {_id, score, cost, date, __v } = elem;
    if (!input.value) {
        alert('Магазина нет, значит нет покупки)');
        deleteThisNote(elem);
        return;
    }
    const response = await fetch(`http://localhost:8000/updateConsuption?_id=${elem._id}`, {
        method: 'PATCH',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            _id: _id,
            score: input.value,
            cost: cost,
            date: date,
            __v: __v
        })
    });
    const result = await response.json();
        consumpArr = result.data;
        renderCostList();
}