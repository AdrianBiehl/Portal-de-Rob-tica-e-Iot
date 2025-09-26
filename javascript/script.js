// ===== GERENCIAMENTO DE TEMA =====
let currentTheme = localStorage.getItem("theme") || "dark";

// Inicializa o tema com base no localStorage
function initializeTheme() {
  currentTheme = localStorage.getItem("theme") || "dark";
  applyTheme(currentTheme);
}

// Alterna entre tema claro e escuro
function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);

  if (document.getElementById("tempChart")) {
    setTimeout(() => {
      const tempChart = Chart.getChart("tempChart");
      const humidityChart = Chart.getChart("humidityChart");
      const speedChart = Chart.getChart("speedChart");

      if (tempChart) tempChart.destroy();
      if (humidityChart) humidityChart.destroy();
      if (speedChart) speedChart.destroy();

      initCharts();
    }, 100);
  }
}

// Aplica o tema selecionado ao documento
function applyTheme(theme) {
  const body = document.body;
  const themeIcon = document.getElementById("theme-icon");
  const modal = document.querySelector(".modal-content");
  const modalInputs = document.querySelectorAll(".modal .form-control");

  if (theme === "light") {
    body.classList.add("light-theme");
    if (themeIcon) {
      themeIcon.className = "fas fa-sun";
      themeIcon.title = "Tema claro ativo - Clique para escuro";
    }
    if (modal) {
      modal.style.backgroundColor = "#ffffff";
      modal.style.color = "#212529";
    }
    modalInputs.forEach((input) => {
      input.style.backgroundColor = "#ffffff";
      input.style.color = "#212529";
      input.style.borderColor = "#ced4da";
    });
  } else {
    body.classList.remove("light-theme");
    if (themeIcon) {
      themeIcon.className = "fas fa-moon";
      themeIcon.title = "Tema escuro ativo - Clique para claro";
    }
    if (modal) {
      modal.style.backgroundColor = "#2d2d2d";
      modal.style.color = "#ffffff";
    }
    modalInputs.forEach((input) => {
      input.style.backgroundColor = "#3a3a3a";
      input.style.color = "#ffffff";
      input.style.borderColor = "#454545";
    });
  }
}

// ===== GERENCIAMENTO DE DADOS =====
let contactMessages = [];
let questions = [];

// Atualiza a lista de perguntas na página FAQ
function updateQuestionsList() {
  const questionsList = document.getElementById("questionsList");

  if (!questionsList) return;

  if (questions.length === 0) {
    questionsList.innerHTML =
      '<p style="color: var(--text-muted-color)" class="text-center">Nenhuma pergunta da comunidade ainda. Seja o primeiro a perguntar!</p>';
    return;
  }

  let html = "";
  questions
    .slice(-5)
    .reverse()
    .forEach((question) => {
      const date = new Date(question.createdAt).toLocaleDateString("pt-BR");
      html += `
            <div class="card-custom mb-3">
                <div class="card-body">
                    <h6 class="card-title"><i class="fas fa-question-circle me-2"></i>${question.title}</h6>
                    <p class="card-text">${question.content}</p>
                    <small style="color: var(--text-muted-color)">
                        Por ${question.author} em ${date}
                    </small>
                </div>
            </div>
        `;
    });

  questionsList.innerHTML = html;
}

// ===== CONFIGURAÇÃO DOS GRÁFICOS =====
// Cores
function getChartColors() {
  const isLight = document.body.classList.contains("light-theme");
  return {
    textColor: isLight ? "#2d3748" : "#e2e8f0",
    gridColor: isLight ? "rgba(44, 82, 130, 0.1)" : "rgba(255, 255, 255, 0.1)",
    legendColor: isLight ? "#2d3748" : "#e2e8f0",
    datasets: {
      temperature: {
        bg: "rgba(44, 82, 130, 0.7)",
        border: "#2c5282",
      },
      humidity: {
        bg: "rgba(66, 153, 225, 0.7)",
        border: "#4299e1",
      },
      speed: {
        bg: "rgba(99, 179, 237, 0.7)",
        border: "#63b3ed",
      },
    },
  };
}

// Inicializa todos os gráficos da página
function initCharts() {
  if (typeof Chart === "undefined") return;

  const colors = getChartColors();

  // Gráfico de Temperatura
  const tempCtx = document.getElementById("tempChart");
  if (tempCtx) {
    new Chart(tempCtx, {
      type: "bar",
      data: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
          {
            label: "Temperatura (°C)",
            data: [22, 20, 25, 28, 30, 26],
            backgroundColor: colors.datasets.temperature.bg,
            borderColor: colors.datasets.temperature.border,
            borderWidth: 1,
            color: colors.textColor,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: colors.textColor,
            },
          },
          tooltip: {
            titleColor: colors.textColor,
            bodyColor: colors.textColor,
            backgroundColor: colors.datasets.temperature.bg,
          },
        },
        scales: {
          y: {
            ticks: { color: colors.textColor },
            grid: { color: colors.gridColor },
          },
          x: {
            ticks: { color: colors.textColor },
            grid: { color: colors.gridColor },
          },
        },
      },
    });
  }

  // Gráfico de Umidade
  const humidityCtx = document.getElementById("humidityChart");
  if (humidityCtx) {
    new Chart(humidityCtx, {
      type: "bar",
      data: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
          {
            label: "Umidade (%)",
            data: [65, 70, 55, 45, 40, 60],
            backgroundColor: "rgba(0, 212, 255, 0.8)",
            borderColor: "#00d4ff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: colors.legendColor,
            },
          },
          tooltip: {
            titleColor: colors.textColor,
            bodyColor: colors.textColor,
          },
        },
        scales: {
          y: {
            ticks: {
              color: colors.textColor,
            },
            grid: {
              color: colors.gridColor,
            },
          },
          x: {
            ticks: {
              color: colors.textColor,
            },
            grid: {
              color: colors.gridColor,
            },
          },
        },
      },
    });
  }

  // Gráfico de Velocidade
  const speedCtx = document.getElementById("speedChart");
  if (speedCtx) {
    new Chart(speedCtx, {
      type: "bar",
      data: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
          {
            label: "Velocidade (km/h)",
            data: [30, 45, 25, 35, 40, 15],
            backgroundColor: colors.datasets.speed.bg,
            borderColor: colors.datasets.speed.border,
            borderWidth: 1,
            color: colors.textColor,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: colors.textColor,
            },
          },
          tooltip: {
            titleColor: colors.textColor,
            bodyColor: colors.textColor,
            backgroundColor: colors.datasets.speed.bg,
          },
        },
        scales: {
          y: {
            ticks: {
              color: colors.textColor,
            },
            grid: {
              color: colors.gridColor,
            },
          },
          x: {
            ticks: {
              color: colors.textColor,
            },
            grid: {
              color: colors.gridColor,
            },
          },
        },
      },
    });
  }
}

// ===== GERENCIAMENTO DE RANKING =====
let scoreModal;
let currentGroup;

function initRanking() {
  if (document.getElementById("scoreModal")) {
    scoreModal = new bootstrap.Modal(document.getElementById("scoreModal"));
  }
}

function openScoreModal(group, currentScore) {
  currentGroup = group;
  document.getElementById("groupName").value = group;
  document.getElementById("newScore").value = currentScore;
  scoreModal.show();
}

function updateScore() {
  const newScore = document.getElementById("newScore").value;
  if (newScore < 0 || newScore > 1000) {
    showNotification("A pontuação deve estar entre 0 e 1000", "error");
    return;
  }

  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    if (row.cells[1].textContent.trim() === currentGroup) {
      row.cells[2].textContent = newScore + " pts";
    }
  });

  scoreModal.hide();
  updateRanking();
  showNotification("Pontuação atualizada com sucesso!", "success");
}

function updateRanking() {
  const tbody = document.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const scoreA = parseInt(a.cells[2].textContent);
    const scoreB = parseInt(b.cells[2].textContent);
    return scoreB - scoreA;
  });

  rows.forEach((row, index) => {
    const position = index + 1;
    const positionCell = row.cells[0];

    row.className = "";

    if (position === 1) {
      row.className = "table-warning";
      positionCell.innerHTML = `<i class="fas fa-crown text-warning me-2"></i>${position}º`;
    } else if (position === 2) {
      positionCell.innerHTML = `<i class="fas fa-medal text-light me-2"></i>${position}º`;
    } else if (position === 3) {
      positionCell.innerHTML = `<i class="fas fa-award text-warning me-2"></i>${position}º`;
    } else {
      positionCell.innerHTML = `${position}º`;
    }

    tbody.appendChild(row);
  });

  updateStats();
}

function updateStats() {
  const scores = Array.from(document.querySelectorAll("tbody tr")).map((row) =>
    parseInt(row.cells[2].textContent)
  );

  const total = scores.reduce((a, b) => a + b, 0);
  const average = (total / scores.length).toFixed(1);
  const max = Math.max(...scores);

  document.querySelector(".stats-card:nth-child(2) .stats-number").textContent =
    average;
  document.querySelector(".stats-card:nth-child(3) .stats-number").textContent =
    max;
}

// Exibe notificações temporárias
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `alert alert-${
    type === "success" ? "success" : "danger"
  } alert-dismissible fade show position-fixed`;
  notification.style.cssText =
    "top: 100px; right: 20px; z-index: 9999; min-width: 300px;";
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

//  INICIALIZAÇÃO DA PÁGINA
document.addEventListener("DOMContentLoaded", function () {
  // Inicializa tema e componentes
  initializeTheme();
  updateQuestionsList();
  initRanking();

  // Inicializa gráficos se estiver na página correta
  if (document.getElementById("tempChart")) {
    setTimeout(() => {
      initCharts();
    }, 500);
  }

  // FORMULÁRIOS
  // Formulário de Contato
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("contactName").value;
      const email = document.getElementById("contactEmail").value;
      const message = document.getElementById("contactMessage").value;

      const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      };

      contactMessages.push(newMessage);

      contactForm.reset();
      showNotification("Mensagem enviada com sucesso!", "success");
    });
  }

  // Formulário de Perguntas
  const questionForm = document.getElementById("questionForm");
  if (questionForm) {
    questionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("questionTitle").value;
      const content = document.getElementById("questionContent").value;

      const newQuestion = {
        id: Date.now(),
        title,
        content,
        author: "Visitante",
        createdAt: new Date().toISOString(),
      };

      questions.push(newQuestion);

      questionForm.reset();
      updateQuestionsList();
      showNotification("Pergunta enviada com sucesso!", "success");
    });
  }
});
