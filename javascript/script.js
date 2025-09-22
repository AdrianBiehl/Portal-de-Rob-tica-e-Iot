// ===== GERENCIAMENTO DE TEMA =====
let currentTheme = localStorage.getItem('theme') || 'dark';

// Inicializa o tema com base no localStorage
function initializeTheme() {
    currentTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(currentTheme);
}

// Alterna entre tema claro e escuro
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
    
    if (document.getElementById('tempChart')) {
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
    const themeIcon = document.getElementById('theme-icon');
    
    if (theme === 'light') {
        body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
            themeIcon.title = 'Tema claro ativo - Clique para escuro';
        }
    } else {
        body.classList.remove('light-theme');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
            themeIcon.title = 'Tema escuro ativo - Clique para claro';
        }
    }
}

// ===== GERENCIAMENTO DE DADOS =====
let contactMessages = [];
let questions = [];

// Atualiza a lista de perguntas na página FAQ
function updateQuestionsList() {
    const questionsList = document.getElementById('questionsList');
    
    if (!questionsList) return;
    
    if (questions.length === 0) {
        questionsList.innerHTML = '<p style="color: var(--text-muted-color)" class="text-center">Nenhuma pergunta da comunidade ainda. Seja o primeiro a perguntar!</p>';
        return;
    }
    
    let html = '';
    questions.slice(-5).reverse().forEach(question => {
        const date = new Date(question.createdAt).toLocaleDateString('pt-BR');
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
// Retorna as cores baseadas no tema atual
function getChartColors() {
    const isLight = document.body.classList.contains('light-theme');
    return {
        textColor: isLight ? '#212529' : '#ffffff',
        gridColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        legendColor: isLight ? '#212529' : '#ffffff',
        datasets: {
            temperature: {
                bg: 'rgba(186, 45, 151, 0.8)',
                border: '#ba2d97'
            },
            humidity: {
                bg: 'rgba(0, 212, 255, 0.8)',
                border: '#00d4ff'
            },
            speed: {
                bg: 'rgba(138, 5, 190, 0.8)',
                border: '#8a05be'
            }
        }
    };
}

// Inicializa todos os gráficos da página
function initCharts() {
    if (typeof Chart === 'undefined') return;

    const colors = getChartColors();
    
    // Gráfico de Temperatura
    const tempCtx = document.getElementById('tempChart');
    if (tempCtx) {
        new Chart(tempCtx, {
            type: 'bar',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: [22, 20, 25, 28, 30, 26],
                    backgroundColor: colors.datasets.temperature.bg,
                    borderColor: colors.datasets.temperature.border,
                    borderWidth: 1,
                    color: colors.textColor
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.textColor
                        }
                    },
                    tooltip: {
                        titleColor: colors.textColor,
                        bodyColor: colors.textColor,
                        backgroundColor: colors.datasets.temperature.bg
                    }
                },
                scales: {
                    y: {
                        ticks: { color: colors.textColor },
                        grid: { color: colors.gridColor }
                    },
                    x: {
                        ticks: { color: colors.textColor },
                        grid: { color: colors.gridColor }
                    }
                }
            }
        });
    }
    
    // Gráfico de Umidade
    const humidityCtx = document.getElementById('humidityChart');
    if (humidityCtx) {
        new Chart(humidityCtx, {
            type: 'bar',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Umidade (%)',
                    data: [65, 70, 55, 45, 40, 60],
                    backgroundColor: 'rgba(0, 212, 255, 0.8)',
                    borderColor: '#00d4ff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.legendColor
                        }
                    },
                    tooltip: {
                        titleColor: colors.textColor,
                        bodyColor: colors.textColor
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: colors.textColor
                        },
                        grid: {
                            color: colors.gridColor
                        }
                    },
                    x: {
                        ticks: {
                            color: colors.textColor
                        },
                        grid: {
                            color: colors.gridColor
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Velocidade
    const speedCtx = document.getElementById('speedChart');
    if (speedCtx) {
        new Chart(speedCtx, {
            type: 'bar',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Velocidade (km/h)',
                    data: [30, 45, 25, 35, 40, 15],
                    backgroundColor: colors.datasets.speed.bg,
                    borderColor: colors.datasets.speed.border,
                    borderWidth: 1,
                    color: colors.textColor
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.textColor
                        }
                    },
                    tooltip: {
                        titleColor: colors.textColor,
                        bodyColor: colors.textColor,
                        backgroundColor: colors.datasets.speed.bg
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: colors.textColor
                        },
                        grid: {
                            color: colors.gridColor
                        }
                    },
                    x: {
                        ticks: {
                            color: colors.textColor
                        },
                        grid: {
                            color: colors.gridColor
                        }
                    }
                }
            }
        });
    }
}

// ===== UTILIDADES =====
// Função para rolar suavemente ao topo da página
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Exibe notificações temporárias
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
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

// ===== INICIALIZAÇÃO DA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa tema e componentes
    initializeTheme();
    updateQuestionsList();
    
    // Inicializa gráficos se estiver na página correta
    if (document.getElementById('tempChart')) {
        setTimeout(() => {
            initCharts();
        }, 500);
    }
    
    // ===== FORMULÁRIOS =====
    // Formulário de Contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            
            const newMessage = {
                id: Date.now(),
                name,
                email,
                message,
                createdAt: new Date().toISOString()
            };
            
            contactMessages.push(newMessage);
            
            contactForm.reset();
            showNotification('Mensagem enviada com sucesso!', 'success');
        });
    }
    
    // Formulário de Perguntas
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('questionTitle').value;
            const content = document.getElementById('questionContent').value;
            
            const newQuestion = {
                id: Date.now(),
                title,
                content,
                author: 'Visitante',
                createdAt: new Date().toISOString()
            };
            
            questions.push(newQuestion);
            
            questionForm.reset();
            updateQuestionsList();
            showNotification('Pergunta enviada com sucesso!', 'success');
        });
    }
    
    // Configura rolagem suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});