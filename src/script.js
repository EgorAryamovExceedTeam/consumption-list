let consumpArr = [];
let storeNameInput = document.getElementById("consumption-name");
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
let storeNameInputCurrentValue = "";
let howMuchInputCurrentValue = "";

howMuchInput.addEventListener("change", (e) => {
  howMuchInputCurrentValue = e.target.value;
});
storeNameInput.addEventListener("change", (e) => {
  storeNameInputCurrentValue = e.target.value;
});

// add new consumption function
const createNewNote = async () => {
  if (storeNameInputCurrentValue && howMuchInputCurrentValue) {
    if (Number(howMuchInputCurrentValue)) {
      const response = await fetch("http://localhost:8000/createConsumption", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          store: storeNameInputCurrentValue,
          cost: howMuchInputCurrentValue,
        }),
      });
      const result = await response.json();
      consumpArr = result.data;
      storeNameInput.value = "";
      howMuchInput.value = "";
      storeNameInputCurrentValue = "";
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
  p.innerText = `Магазин "${elem.store}"`;
  p.id = `store-${elem._id}`;
  p.className = "name";
  p.ondblclick = () => editField(elem,'store', p);

  return p;
};

// create date of note
const date = (elem, index) => {
  const p = document.createElement("p");
  p.innerText = elem.date;
  p.className = "date";
  p.id = `date-${elem._id}`;
  p.ondblclick = () => editField(elem, 'date', p);

  return p;
};

// create sum of cost
const sum = (elem, index) => {
  const p = document.createElement("p");
  p.innerText = `${elem.cost} p.`;
  p.className = `cost`;
  p.id = `cost-${elem._id}`;
  p.ondblclick = () => editField(elem, 'cost', p);

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
  garbage.onclick = () => deleteThisNote(elem);

  return { pencil, garbage };
};
///////////////////////////////////////////////////////////////////

// edit fiel to double click
const editField = (element, field, htmlElem) => {
  let {_id, store, cost, date, __v } = element;
    const input = document.createElement('input');
    input.type = (field === 'store' || field === 'cost') ? 'text' : 'date';

    const editImage = document.getElementById(`edit-${_id}`);
    const deleteImage = document.getElementById(`delete-${_id}`);
    editImage.style.visibility = 'hidden';
    deleteImage.style.visibility = 'hidden';

    switch (field) {
      case 'store': {
        input.value = store;
        break;
      }
      case 'date': {
        input.value = date;
        break;
      }
      case 'cost': {
        input.value = cost;
        break;
      }
    }

    const li = document.getElementById(`li-${_id}`);
    storeNameElem = li.replaceChild(input, htmlElem);

    input.focus();
    
    input.onblur = () => saveOrDelete(input, element, field);
}

// delete Note from DB
const deleteThisNote = async (elem) => {
    const response = await fetch(`http://localhost:8000/deleteConsumption?_id=${elem._id}`, {
            method: 'DELETE',
        })
        const result = await response.json();
        consumpArr = result.data;
        renderTotalSum();
        renderCostList();
}

//saves or deletes note
const saveOrDelete = async (input, elem, replacement) => {
    let {_id, store, cost, date, __v } = elem;

    if (!input.value) {
        alert('Нет записи - нет покупки)');
        deleteThisNote(elem);
        return;
    }

    switch (replacement) {
        case 'store': {
          store = input.value;
          break;
        }
        case 'date': {
          date = input.value;
          break;
        }
        case 'cost': {
          cost = input.value;
        }
    }

    const response = await fetch(`http://localhost:8000/updateConsuption?_id=${elem._id}`, {
        method: 'PATCH',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            _id: _id,
            store: store,
            cost: cost,
            date: date,
            __v: __v
        })
    });

    const result = await response.json();
        consumpArr = result.data;
        renderTotalSum();
        renderCostList();
}

//edit all fields