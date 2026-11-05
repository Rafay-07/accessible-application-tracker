// Co-op Application Tracker
// Stores applications in localStorage and renders an accessible, filterable table.

const STORAGE_KEY = "coopApplications";

const form = document.getElementById("app-form");
const rows = document.getElementById("app-rows");
const filterStatus = document.getElementById("filter-status");
const search = document.getElementById("search");
const summary = document.getElementById("summary");

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function save(apps) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    // Storage can be blocked in private windows; the page still works for this session.
  }
}

let apps = load();

// Show or clear an error message and tie it to its field for screen readers.
function setError(input, message, show) {
  const error = document.getElementById(input.id + "-error");
  input.setAttribute("aria-invalid", show ? "true" : "false");
  error.textContent = message;
  error.hidden = !show;
}

function validate() {
  const company = document.getElementById("company");
  const role = document.getElementById("role");
  const companyOk = company.value.trim() !== "";
  const roleOk = role.value.trim() !== "";
  setError(company, "Enter a company name.", !companyOk);
  setError(role, "Enter a role.", !roleOk);
  if (!companyOk) { company.focus(); return false; }
  if (!roleOk) { role.focus(); return false; }
  return true;
}

function render() {
  const status = filterStatus.value;
  const term = search.value.trim().toLowerCase();

  const visible = apps
    .filter(a => status === "All" || a.status === status)
    .filter(a => (a.company + " " + a.role).toLowerCase().includes(term))
    .sort((a, b) => (a.deadline || "9999").localeCompare(b.deadline || "9999"));

  rows.innerHTML = "";
  visible.forEach(app => {
    const tr = document.createElement("tr");

    ["company", "role"].forEach(key => {
      const td = document.createElement("td");
      td.textContent = app[key];
      tr.appendChild(td);
    });

    const deadline = document.createElement("td");
    deadline.textContent = app.deadline || "None";
    tr.appendChild(deadline);

    // Status is editable in place with a labelled select.
    const statusCell = document.createElement("td");
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Status for " + app.company + " " + app.role);
    ["Not applied", "Applied", "Interview", "Offer", "Rejected"].forEach(s => {
      const opt = document.createElement("option");
      opt.textContent = s;
      if (s === app.status) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => {
      app.status = select.value;
      save(apps);
      summary.textContent = app.company + " status changed to " + app.status + ".";
    });
    statusCell.appendChild(select);
    tr.appendChild(statusCell);

    const actions = document.createElement("td");
    const del = document.createElement("button");
    del.type = "button";
    del.className = "secondary";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete " + app.company + " " + app.role);
    del.addEventListener("click", () => {
      apps = apps.filter(a => a.id !== app.id);
      save(apps);
      render();
      summary.textContent = "Deleted " + app.company + ". " + summary.textContent;
      filterStatus.focus();
    });
    actions.appendChild(del);
    tr.appendChild(actions);

    rows.appendChild(tr);
  });

  // Announced by screen readers through aria-live on #summary.
  summary.textContent = "Showing " + visible.length + " of " + apps.length + " applications.";
}

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!validate()) return;

  apps.push({
    id: Date.now(),
    company: form.company.value.trim(),
    role: form.role.value.trim(),
    deadline: form.deadline.value,
    status: form.status.value
  });
  save(apps);
  form.reset();
  render();
  summary.textContent = "Application added. " + summary.textContent;
  document.getElementById("company").focus();
});

filterStatus.addEventListener("change", render);
search.addEventListener("input", render);

render();
