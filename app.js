const STORAGE_KEY = "cash-arc-v1";

const state = loadState();

const el = {
  kpiCurrentCapital: document.getElementById("kpiCurrentCapital"),
  kpiLatestNet: document.getElementById("kpiLatestNet"),
  kpiTotalGrowth: document.getElementById("kpiTotalGrowth"),
  kpiFixedIncome: document.getElementById("kpiFixedIncome"),
  monthlyTableBody: document.getElementById("monthlyTableBody"),
  addMonthButton: document.getElementById("addMonthButton"),
  monthForm: document.getElementById("monthForm"),
  settingsForm: document.getElementById("settingsForm"),
  entryForm: document.getElementById("entryForm"),
  entryPreviewList: document.getElementById("entryPreviewList"),
  growthBars: document.getElementById("growthBars"),
};

init();

function init() {
  bindModalHandlers();
  bindForms();
  renderAll();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        initialCapital: 0,
        fixedIncome: 0,
        months: {},
      };
    }
    return normalizeState(JSON.parse(raw));
  } catch {
    return {
      initialCapital: 0,
      fixedIncome: 0,
      months: {},
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindModalHandlers() {
  const openButtons = document.querySelectorAll("[data-open-modal]");
  const closeButtons = document.querySelectorAll("[data-close-modal]");
  const modals = document.querySelectorAll(".modal");

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.getAttribute("data-open-modal"));
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modals.forEach((modal) => {
        if (!modal.hidden) {
          closeModal(modal.id);
        }
      });
    }
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) {
    return;
  }

  if (id === "settingsModal") {
    el.settingsForm.initialCapital.value = state.initialCapital;
    el.settingsForm.fixedIncome.value = state.fixedIncome;
  }

  if (id === "entryModal") {
    const latestMonth = getMonths().at(-1) || todayMonth();
    el.entryForm.month.value = latestMonth;
    renderEntryPreview(latestMonth);
  }

  if (id === "analysisModal") {
    renderGrowthBars();
  }

  if (id === "monthModal") {
    el.monthForm.month.value = todayMonth();
  }

  modal.hidden = false;
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.hidden = true;
  }
}

function bindForms() {
  el.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const initialCapital = Number(el.settingsForm.initialCapital.value || 0);
    const fixedIncome = Number(el.settingsForm.fixedIncome.value || 0);

    state.initialCapital = Math.max(0, initialCapital);
    state.fixedIncome = Math.max(0, fixedIncome);

    saveState();
    renderAll();
    closeModal("settingsModal");
  });

  el.entryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const month = el.entryForm.month.value;
    const type = el.entryForm.type.value;
    const label = el.entryForm.label.value.trim();
    const amount = Number(el.entryForm.amount.value || 0);

    if (!month || !type || !label || amount <= 0) {
      return;
    }

    ensureMonth(month);

    const record = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      label,
      amount,
      createdAt: Date.now(),
    };

    if (type === "extraIncome") {
      state.months[month].extraIncomes.push(record);
    } else {
      state.months[month].expenses.push(record);
    }

    saveState();
    el.entryForm.label.value = "";
    el.entryForm.amount.value = "";
    renderAll();
    renderEntryPreview(month);
  });

  el.entryForm.month.addEventListener("change", (event) => {
    renderEntryPreview(event.target.value);
  });

  el.addMonthButton.addEventListener("click", () => {
    openModal("monthModal");
  });

  el.monthForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const month = el.monthForm.month.value;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return;
    }

    ensureMonth(month);
    saveState();
    renderAll();
    closeModal("monthModal");
  });

  el.entryPreviewList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-id]");
    if (!button) {
      return;
    }

    const month = el.entryPreviewList.dataset.month;
    const removeId = button.getAttribute("data-remove-id");
    const removeType = button.getAttribute("data-remove-type");

    if (!month || !state.months[month]) {
      return;
    }

    if (!confirm("이 내역을 삭제할까요?")) {
      return;
    }

    const key = removeType === "expense" ? "expenses" : "extraIncomes";
    state.months[month][key] = state.months[month][key].filter(
      (item) => item.id !== removeId,
    );

    saveState();
    renderAll();
    renderEntryPreview(month);
  });
}

function ensureMonth(month) {
  if (!state.months[month]) {
    state.months[month] = {
      extraIncomes: [],
      expenses: [],
    };
  }
}

function getMonths() {
  return Object.keys(state.months).sort();
}

function computeMonthlyRows() {
  const months = getMonths();
  const rows = [];
  let rollingCapital = state.initialCapital;

  months.forEach((month) => {
    const record = state.months[month];
    const extraIncome = sum(record.extraIncomes.map((item) => item.amount));
    const totalIncome = state.fixedIncome + extraIncome;
    const totalExpense = sum(record.expenses.map((item) => item.amount));
    const net = totalIncome - totalExpense;
    const growth = rollingCapital > 0 ? (net / rollingCapital) * 100 : null;
    const endCapital = rollingCapital + net;

    rows.push({
      month,
      startCapital: rollingCapital,
      totalIncome,
      totalExpense,
      net,
      growth,
      endCapital,
    });

    rollingCapital = endCapital;
  });

  return rows;
}

function renderAll() {
  const rows = computeMonthlyRows();
  renderKpis(rows);
  renderTable(rows);
}

function renderKpis(rows) {
  const latest = rows.at(-1);
  const currentCapital = latest ? latest.endCapital : state.initialCapital;
  const latestNet = latest ? latest.net : 0;
  const totalGrowth =
    state.initialCapital > 0
      ? ((currentCapital - state.initialCapital) / state.initialCapital) * 100
      : 0;

  el.kpiCurrentCapital.textContent = formatWon(currentCapital);
  el.kpiLatestNet.textContent = formatWon(latestNet);
  el.kpiLatestNet.className = `value ${toneClass(latestNet)}`;
  el.kpiTotalGrowth.textContent = `${formatPercent(totalGrowth)}`;
  el.kpiTotalGrowth.className = `value ${toneClass(totalGrowth)}`;
  el.kpiFixedIncome.textContent = formatWon(state.fixedIncome);
}

function renderTable(rows) {
  if (!rows.length) {
    el.monthlyTableBody.innerHTML =
      '<tr><td colspan="7" class="empty">데이터를 추가하면 월별 현황이 표시됩니다.</td></tr>';
    return;
  }

  el.monthlyTableBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td>${row.month}</td>
        <td>${formatWon(row.startCapital)}</td>
        <td>${formatWon(row.totalIncome)}</td>
        <td>${formatWon(row.totalExpense)}</td>
        <td class="${toneClass(row.net)}">${formatWon(row.net)}</td>
        <td class="${toneClass(row.growth || 0)}">${row.growth === null ? "-" : formatPercent(row.growth)}</td>
        <td>${formatWon(row.endCapital)}</td>
      </tr>
    `,
    )
    .join("");
}

function renderEntryPreview(month) {
  el.entryPreviewList.dataset.month = month || "";

  if (!month || !state.months[month]) {
    el.entryPreviewList.innerHTML = "<li>해당 월 데이터가 없습니다.</li>";
    return;
  }

  const record = state.months[month];
  const items = [
    ...record.extraIncomes.map((v) => ({ ...v, type: "extraIncome" })),
    ...record.expenses.map((v) => ({ ...v, type: "expense" })),
  ].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  const rows = items.map((item) => {
    const sign = item.type === "expense" ? "-" : "+";
    return `
      <li class="entry-item">
        <span>${sign} ${escapeHtml(item.label)}: ${formatWon(item.amount)}</span>
        <button
          type="button"
          class="mini-btn"
          data-remove-id="${item.id}"
          data-remove-type="${item.type}"
        >
          삭제
        </button>
      </li>
    `;
  });

  el.entryPreviewList.innerHTML = rows.length
    ? rows.join("")
    : "<li>아직 입력된 내역이 없습니다.</li>";
}

function renderGrowthBars() {
  const rows = computeMonthlyRows();

  if (!rows.length) {
    el.growthBars.innerHTML = "<p class='analysis-note'>분석할 데이터가 없습니다.</p>";
    return;
  }

  const maxAbsGrowth =
    Math.max(...rows.map((row) => Math.abs(row.growth || 0)), 1) * 1.15;

  el.growthBars.innerHTML = rows
    .map((row) => {
      const growth = row.growth || 0;
      const width = Math.min((Math.abs(growth) / maxAbsGrowth) * 100, 100);
      const signClass = growth >= 0 ? "pos" : "neg";

      return `
        <div class="bar-row">
          <strong>${row.month}</strong>
          <div class="track"><div class="fill ${signClass}" style="width: ${width}%"></div></div>
          <span class="${toneClass(growth)}">${formatPercent(growth)}</span>
        </div>
      `;
    })
    .join("");
}

function normalizeState(input) {
  const normalized = {
    initialCapital: Number(input?.initialCapital || 0),
    fixedIncome: Number(input?.fixedIncome || 0),
    months: {},
  };

  Object.entries(input?.months || {}).forEach(([month, record]) => {
    const normalizeItems = (items) =>
      Array.isArray(items)
        ? items
            .map((item) => ({
              id: item.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
              label: String(item.label || "").trim(),
              amount: Number(item.amount || 0),
              createdAt: Number(item.createdAt || Date.now()),
            }))
            .filter((item) => item.label && item.amount > 0)
        : [];

    normalized.months[month] = {
      extraIncomes: normalizeItems(record?.extraIncomes),
      expenses: normalizeItems(record?.expenses),
    };
  });

  return normalized;
}

function sum(values) {
  return values.reduce((acc, value) => acc + value, 0);
}

function toneClass(value) {
  if (value > 0) {
    return "positive";
  }
  if (value < 0) {
    return "negative";
  }
  return "";
}

function formatWon(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}₩${Math.abs(Math.round(value)).toLocaleString("ko-KR")}`;
}

function formatPercent(value) {
  const rounded = Number(value.toFixed(2));
  return `${rounded > 0 ? "+" : ""}${rounded.toLocaleString("ko-KR")}%`;
}

function todayMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
