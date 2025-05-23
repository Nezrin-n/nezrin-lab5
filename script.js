let data = null;

fetch("data.json")
    .then(response => response.json())
    .then(d => {
        data = d;
        const localStorageData = window.localStorage.getItem("data");
        if (localStorageData) {
            data = JSON.parse(localStorageData);
        }
        render();
    });

let editMode = false;

function renderHeader() {
    const nameEl = document.getElementById("name");
    const surnameEl = document.getElementById("surname");
    const titleEl = document.getElementById("title");

    if (editMode) {
        const nameInput = document.createElement("input");
        nameInput.value = data.name;
        nameInput.oninput = (e) => data.name = e.target.value;
        nameEl.innerHTML = "";
        nameEl.appendChild(nameInput);

        const surnameInput = document.createElement("input");
        surnameInput.value = data.surname;
        surnameInput.oninput = (e) => data.surname = e.target.value;
        surnameEl.innerHTML = "";
        surnameEl.appendChild(surnameInput);

        const titleInput = document.createElement("input");
        titleInput.value = data.jobTitle;
        titleInput.oninput = (e) => data.jobTitle = e.target.value;
        titleEl.innerHTML = "";
        titleEl.appendChild(titleInput);
    } else {
        nameEl.innerText = data.name;
        surnameEl.innerText = data.surname;
        titleEl.innerText = data.jobTitle;
    }
}

function renderList(id, items) {
    const container = document.getElementById(id);
    container.innerHTML = "";
    items.forEach((item, idx) => {
        const li = document.createElement("li");
        if (editMode) {
            const input = document.createElement("input");
            input.type = "text";
            input.value = item;
            input.oninput = (e) => data[id][idx] = e.target.value;
            li.appendChild(input);
            addDeleteBtn(li, id, idx);
        } else {
            li.innerText = item;
        }
        container.appendChild(li);
    });

    if (editMode) addAddBtn(container, id);
}

function renderEducation() {
    const container = document.getElementById("education");
    container.innerHTML = "";
    data.education.forEach((item, idx) => {
        const div = document.createElement("div");
        if (editMode) {
            ["period", "institution"].forEach((key) => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = item[key];
                input.oninput = (e) => data.education[idx][key] = e.target.value;
                div.appendChild(input);
            });
            addDeleteBtn(div, "education", idx);
        } else {
            div.innerHTML = `<strong>${item.period}</strong><br>${item.institution}`;
        }
        container.appendChild(div);
    });

    if (editMode) addAddBtn(container, "education", {
        period: "", institution: ""
    });
}

function renderProfile() {
    const container = document.getElementById("profile");
    container.innerHTML = "";
    if (editMode) {
        const textarea = document.createElement("textarea");
        textarea.value = data.profile;
        textarea.oninput = (e) => data.profile = e.target.value;
        container.appendChild(textarea);
    } else {
        container.innerText = data.profile;
    }
}

document.getElementById("resetBtn").onclick = () => {
    window.localStorage.removeItem("data");
    location.reload();
};

function renderExperience() {
    const container = document.getElementById("experience");
    container.innerHTML = "";
    data.experience.forEach((exp, idx) => {
        const job = document.createElement("div");
        job.className = "job";

        if (editMode) {
            ["company", "title", "period"].forEach((key) => {
                const input = document.createElement("input");
                input.value = exp[key];
                input.oninput = (e) => data.experience[idx][key] = e.target.value;
                job.appendChild(input);
            });

            exp.tasks.forEach((task, tIdx) => {
                const input = document.createElement("input");
                input.value = task;
                input.oninput = (e) => exp.tasks[tIdx] = e.target.value;
                job.appendChild(input);
                addDeleteBtn(job, "experience", idx, "tasks", tIdx);
            });

            const addTask = document.createElement("button");
            addTask.className = "add-btn";
            addTask.innerText = "+ Add Task";
            addTask.onclick = () => {
                data.experience[idx].tasks.push("");
                render();
            };
            job.appendChild(addTask);

            addDeleteBtn(job, "experience", idx);
        } else {
            job.innerHTML = `<h4>${exp.company}</h4><p><strong></strong></p>`;
            const ul = document.createElement("ul");
            exp.tasks.forEach(t => {
                const li = document.createElement("li");
                li.innerText = t;
                ul.appendChild(li);
            });
            job.appendChild(ul);
        }
        container.appendChild(job);
    });

    if (editMode) addAddBtn(container, "experience", {
        company: "", title: "", period: "", tasks: [""]
    });
}

function renderReferences() {
    const container = document.getElementById("references");
    container.innerHTML = "";
    data.references.forEach((ref, idx) => {
        const div = document.createElement("div");
        if (editMode) {
            ["name", "position", "phone", "email"].forEach(key => {
                const input = document.createElement("input");
                input.value = ref[key];
                input.oninput = (e) => data.references[idx][key] = e.target.value;
                div.appendChild(input);
            });
            addDeleteBtn(div, "references", idx);
        } else {
            div.innerHTML = `<p><strong>${ref.name}</strong><br>${ref.position}<br>📞 ${ref.phone}<br>✉️ ${ref.email}</p>`;
        }
        container.appendChild(div);
    });

    if (editMode) addAddBtn(container, "references", {
        name: "", position: "", phone: "", email: ""
    });
}

function addAddBtn(container, key, value = "") {
    const btn = document.createElement("button");
    btn.innerText = "+ Add";
    btn.className = "add-btn";
    btn.onclick = () => {
        data[key].push(value);
        render();
    };
    container.appendChild(btn);
}

function addDeleteBtn(container, key, index, subkey = null, subindex = null) {
    const btn = document.createElement("button");
    btn.innerText = "🗑";
    btn.className = "delete-btn";
    btn.onclick = () => {
        if (subkey) {
            data[key][index][subkey].splice(subindex, 1);
        } else {
            data[key].splice(index, 1);
        }
        render();
    };
    container.appendChild(btn);
}

function render() {
    renderHeader();
    renderList("contact", data.contact);
    renderList("skills", data.skills);
    renderList("languages", data.languages);
    renderEducation();
    renderProfile();
    renderExperience();
    renderReferences();
}

document.getElementById("editBtn").onclick = () => {
    editMode = true;
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("saveBtn").style.display = "inline-block";
    render();
};

document.getElementById("saveBtn").onclick = () => {
    editMode = false;
    document.getElementById("editBtn").style.display = "inline-block";
    document.getElementById("saveBtn").style.display = "none";
    console.log("Saved Data:", data);
    window.localStorage.setItem("data", JSON.stringify(data));
    render();
};

document.querySelectorAll(".accordion-button").forEach(button => {
    button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        const isOpen = content.style.display === "block";
        content.style.display = isOpen ? "none" : "block";
    });
});