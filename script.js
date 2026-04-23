const form = document.querySelector("#toxin-form");
const volumeInput = document.querySelector("#volume");
const syringeSelect = document.querySelector("#syringe");
const customField = document.querySelector("#custom-field");
const customDivisionsInput = document.querySelector("#custom-divisions");
const unitsInput = document.querySelector("#units");
const resultOutput = document.querySelector("#result");
const resultHint = document.querySelector("#result-hint");
const resultPanel = document.querySelector(".result-panel");

const formatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

function getDivisions() {
  if (syringeSelect.value === "custom") {
    return Number(customDivisionsInput.value);
  }

  return Number(syringeSelect.value);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return formatter.format(value);
}

function calculate() {
  const volume = Number(volumeInput.value);
  const divisions = getDivisions();
  const units = Number(unitsInput.value);
  const columnD = volume * divisions;
  const result = units / columnD;

  customField.hidden = syringeSelect.value !== "custom";

  if (!volume || !divisions || !units || !Number.isFinite(result)) {
    resultOutput.textContent = "0";
    resultHint.textContent = "Заполните все поля, чтобы получить количество единиц токсина в одном делении.";
    resultPanel.classList.remove("is-stale");
    return;
  }

  resultOutput.textContent = formatNumber(result);
  resultHint.textContent = "Количество единиц токсина в одном делении шприца:";
  resultPanel.classList.remove("is-stale");
}

function markAsNeedsCalculation() {
  customField.hidden = syringeSelect.value !== "custom";

  if (resultOutput.textContent !== "—") {
    resultHint.textContent = "Данные изменились. Нажмите «Рассчитать», чтобы обновить результат.";
    resultPanel.classList.add("is-stale");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
});

form.addEventListener("input", markAsNeedsCalculation);
form.addEventListener("change", markAsNeedsCalculation);

customField.hidden = syringeSelect.value !== "custom";
