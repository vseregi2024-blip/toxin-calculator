const form = document.querySelector("#toxin-form");
const volumeInput = document.querySelector("#volume");
const syringeSelect = document.querySelector("#syringe");
const customField = document.querySelector("#custom-field");
const customDivisionsInput = document.querySelector("#custom-divisions");
const unitsInput = document.querySelector("#units");
const resultOutput = document.querySelector("#result");
const resultHint = document.querySelector("#result-hint");
const resultPanel = document.querySelector(".result-panel");
const languageButtons = document.querySelectorAll(".language-switcher__button");

const translations = {
  ru: {
    page_title: "Расчет токсина на 1 деление шприца",
    eyebrow: "Онлайн-калькулятор",
    hero_title: "Расчёт, сколько единиц токсина в одном делении шприца",
    step_1: "Напишите в мл, каким количеством физраствора вы хотите развести токсин.",
    step_2: "Укажите, какой у вас шприц.",
    step_3: "Напишите, сколько делений в вашем шприце.",
    step_4: "Укажите, сколько единиц токсина во флаконе.",
    step_5: "Нажмите кнопку «Рассчитать».",
    hero_text: "В ответе вы получите количество единиц токсина в одном делении.",
    data_eyebrow: "Данные",
    calculator_title: "Заполните розовые поля",
    label_volume: "Объем NaCl, мл",
    label_syringe: "Шприц",
    option_u100_100: "U-100, 100 делений",
    option_u100_50: "U-100, 50 делений",
    option_u40_40: "U-40, 40 делений",
    option_u100_05: "U-100 0,5 мл, 100 делений",
    option_u100_03: "U-100 0,3 мл, 100 делений",
    option_custom: "Другое количество делений",
    label_custom_divisions: "Количество делений в шприце",
    label_units: "Единиц токсина во флаконе",
    button_calculate: "Рассчитать",
    result_eyebrow: "Ключевой результат",
    result_unit: "ед. / 1 деление",
    hint_default: "Заполните поля и нажмите «Рассчитать».",
    hint_invalid: "Заполните все поля, чтобы получить количество единиц токсина в одном делении.",
    hint_ready: "Количество единиц токсина в одном делении шприца:",
    hint_stale: "Данные изменились. Нажмите «Рассчитать», чтобы обновить результат.",
  },
  uk: {
    page_title: "Розрахунок токсину на 1 поділку шприца",
    eyebrow: "Онлайн-калькулятор",
    hero_title: "Розрахунок, скільки одиниць токсину в одній поділці шприца",
    step_1: "Напишіть у мл, якою кількістю фізрозчину ви хочете розвести токсин.",
    step_2: "Вкажіть, який у вас шприц.",
    step_3: "Напишіть, скільки поділок у вашому шприці.",
    step_4: "Вкажіть, скільки одиниць токсину у флаконі.",
    step_5: "Натисніть кнопку «Розрахувати».",
    hero_text: "У відповіді ви отримаєте кількість одиниць токсину в одній поділці.",
    data_eyebrow: "Дані",
    calculator_title: "Заповніть рожеві поля",
    label_volume: "Об'єм NaCl, мл",
    label_syringe: "Шприц",
    option_u100_100: "U-100, 100 поділок",
    option_u100_50: "U-100, 50 поділок",
    option_u40_40: "U-40, 40 поділок",
    option_u100_05: "U-100 0,5 мл, 100 поділок",
    option_u100_03: "U-100 0,3 мл, 100 поділок",
    option_custom: "Інша кількість поділок",
    label_custom_divisions: "Кількість поділок у шприці",
    label_units: "Одиниць токсину у флаконі",
    button_calculate: "Розрахувати",
    result_eyebrow: "Ключовий результат",
    result_unit: "од. / 1 поділка",
    hint_default: "Заповніть поля і натисніть «Розрахувати».",
    hint_invalid: "Заповніть усі поля, щоб отримати кількість одиниць токсину в одній поділці.",
    hint_ready: "Кількість одиниць токсину в одній поділці шприца:",
    hint_stale: "Дані змінилися. Натисніть «Розрахувати», щоб оновити результат.",
  },
};

let currentLanguage = "ru";

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

function t(key) {
  return translations[currentLanguage][key];
}

function applyTranslations(language) {
  currentLanguage = language;
  document.documentElement.lang = language === "uk" ? "uk" : "ru";
  document.title = t("page_title");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;

    if (translations[language][key]) {
      node.textContent = translations[language][key];
    }
  });

  languageButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === language);
  });

  if (resultOutput.textContent === "—") {
    resultHint.textContent = t("hint_default");
    return;
  }

  if (resultPanel.classList.contains("is-stale")) {
    resultHint.textContent = t("hint_stale");
    return;
  }

  resultHint.textContent = t("hint_ready");
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
    resultHint.textContent = t("hint_invalid");
    resultPanel.classList.remove("is-stale");
    return;
  }

  resultOutput.textContent = formatNumber(result);
  resultHint.textContent = t("hint_ready");
  resultPanel.classList.remove("is-stale");
}

function markAsNeedsCalculation() {
  customField.hidden = syringeSelect.value !== "custom";

  if (resultOutput.textContent !== "—") {
    resultHint.textContent = t("hint_stale");
    resultPanel.classList.add("is-stale");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
});

form.addEventListener("input", markAsNeedsCalculation);
form.addEventListener("change", markAsNeedsCalculation);

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTranslations(button.dataset.lang);
  });
});

customField.hidden = syringeSelect.value !== "custom";
applyTranslations(currentLanguage);
