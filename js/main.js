// Get Elements
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const add_btn = document.getElementById("add");

//  data storage
let data = new Object();
// create id
let id = localStorage.getItem("id") || 0;

//  add items to the list
const add_child = (value, id, state) => {
  let li = document.createElement("li");
  // contains the check input and the value
  let div = document.createElement("div");
  let check = document.createElement("input");
  let p_tag = document.createElement("p");
  //  contains the edit button and the delete button
  let btn_container = document.createElement("div");
  let edit = document.createElement("button");
  let del = document.createElement("button");

  li.id = id;
  li.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "pb-2",
    "border-b-[1px]",
    "border-solid",
    "border-[#ccc]",
    "mb-2"
  );
  li.setAttribute("done", state);

  div.classList.add("flex");
  // controll the state of the task
  state
    ? div.classList.add("line-through")
    : div.classList.remove("line-through");

  check.type = "checkbox";
  check.classList.add("check", "mr-2.5");
  check.id = id;
  check.checked = state;

  p_tag.textContent = value;

  btn_container.classList.add("btn_container");
  // edit button style
  edit.classList.add(
    "edit",
    "btn",
    "text-[papayawhip]",
    "p-[0_10px]",
    "text-2xl",
    "rounded-2xl"
  );
  edit.id = id;
  edit.textContent = "Edit";

  del.classList.add(
    "del",
    "btn",
    "text-[papayawhip]",
    "p-[0_10px]",
    "text-2xl",
    "rounded-2xl"
  );
  del.id = id;
  del.textContent = "Delete";

  taskList.appendChild(li);
  div.appendChild(check);
  div.appendChild(p_tag);
  li.appendChild(div);
  btn_container.appendChild(edit);
  btn_container.appendChild(del);
  li.appendChild(btn_container);

  // update data in localStorage
  data[id] = [value, state];
  localStorage.setItem("data", JSON.stringify(data));
};

// fill taskList
const fillTaskList = () => {
  data = JSON.parse(localStorage.getItem("data")) || {};
  taskList.innerHTML = "";
  console.log(Object.keys(data));
  Object.keys(data).forEach((key) => {
    add_child(data[key][0], key, data[key][1]);
  });
};
fillTaskList();

//  Add button functionality
add_btn.addEventListener("click", () => {
  let value = taskInput.value.trim();
  if (/\w/gi.test(value)) {
    let state = false;
    add_child(value, id, state);
    id++;

    taskInput.value = "";
  } else {
    alert("Please enter a valid task");
  }
  localStorage.setItem("id", id);
});

// Edit button functionality
const editFN = (container, p) => {
  const input = document.createElement("input");
  input.type = "text";
  input.value = p.textContent;
  input.id = "editableText";
  input.classList.add("text-black");
  container.replaceChild(input, p);
  input.focus();

  // when blur
  input.addEventListener("blur", () => {
    const newP = document.createElement("p");
    newP.id = "editableText";
    newP.textContent = input.value;
    newP.style.cursor = "pointer";
    container.replaceChild(newP, input);

    // return <p>
    newP.addEventListener("click", arguments.callee);
  });

  // when Enter
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      input.blur();
    }
  });
};

// Edit and Delete , Check buttons functionality
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    console.log(e.target.parentNode.parentNode.getAttribute("done"));

    if (e.target.parentNode.parentNode.getAttribute("done") === "true") {
      return;
    } else {
      const container = e.target.parentNode.parentNode.firstChild;
      const p = e.target.parentNode.parentNode.firstChild.lastChild;

      editFN(container, p);
    }
  } else if (e.target.classList.contains("del")) {
    console.log(e.target);
    delete data[e.target.id];
    localStorage.setItem("data", JSON.stringify(data));
    fillTaskList();
  } else if (e.target.classList.contains("check")) {
    e.target.parentNode.classList.toggle("line-through");
    e.target.parentNode.parentNode.setAttribute(
      "done",
      `${!data[e.target.id][1]}`
    );

    data[e.target.id][1] = !data[e.target.id][1];
    localStorage.setItem("data", JSON.stringify(data));
  }
});
