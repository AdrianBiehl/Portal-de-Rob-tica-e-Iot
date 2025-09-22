// Theme management
let currentTheme = 'dark'; // default theme

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    currentTheme = savedTheme;
    applyTheme(savedTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Reinitialize charts with new theme colors if on charts page
    if (document.getElementById('tempChart')) {
        setTimeout(() => {
            // Clear existing charts
            Chart.getChart("tempChart")?.destroy();
            Chart.getChart("humidityChart")?.destroy();
            Chart.getChart("speedChart")?.destroy();
            initCharts();
        }, 100);
    }
}

function applyTheme(theme) {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    if (theme === 'light') {
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
        themeIcon.title = 'Tema claro ativo - Clique para escuro';
    } else {
        body.classList.remove('light-theme');
        themeIcon.className = 'fas fa-moon';
        themeIcon.title = 'Tema escuro ativo - Clique para claro';
    }
}

// In-memory storage for user data and questions
let contactMessages = [];
let questions = [];

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('portalQuestions', JSON.stringify(questions));
        localStorage.setItem('portalMessages', JSON.stringify(contactMessages));
    } catch (e) {
        console.log('Error saving data');
    }
}

// Load saved data from localStorage
function loadData() {
    try {
        const savedQuestions = localStorage.getItem('portalQuestions');
        const savedMessages = localStorage.getItem('portalMessages');
        
        if (savedQuestions) questions = JSON.parse(savedQuestions);
        if (savedMessages) contactMessages = JSON.parse(savedMessages);
    } catch (e) {
        console.log('No saved data found or error loading data');
    }
}

// Update questions list
function updateQuestionsList() {
    const questionsList = document.getElementById('questionsList');
    
    if (!questionsList) return; // Only run on FAQ page
    
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

// Charts initialization with theme support
function getChartColors() {
    const isLight = document.body.classList.contains('light-theme');
    return {
        textColor: isLight ? '#212529' : '#ffffff',
        gridColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
    };
}

function initCharts() {
    const colors = getChartColors();
    
    // Temperature Chart
    const tempCtx = document.getElementById('tempChart');
    if (tempCtx) {
        new Chart(tempCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: [22, 20, 25, 28, 30, 26],
                    borderColor: '#8a05be',
                    backgroundColor: 'rgba(138, 5, 190, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.textColor
                        }
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
    
    // Humidity Chart
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
                            color: colors.textColor
                        }
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
    
    // Speed Chart
    const speedCtx = document.getElementById('speedChart');
    if (speedCtx) {
        new Chart(speedCtx, {
            type: 'doughnut',
            data: {
                labels: ['Baixa', 'Média', 'Alta'],
                datasets: [{
                    data: [30, 45, 25],
                    backgroundColor: [
                        '#ba2d97',
                        '#8a05be',
                        '#00d4ff'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.textColor
                        }
                    }
                }
            }
        });
    }
}

// Utility functions
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme(); // Initialize theme first
    loadData();
    updateQuestionsList();
    
    // Contact form
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
            saveData();
            
            // Reset form
            contactForm.reset();
            showNotification('Mensagem enviada com sucesso!', 'success');
        });
    }
    
    // Question form
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
            saveData();
            
            // Reset form
            questionForm.reset();
            updateQuestionsList();
            showNotification('Pergunta enviada com sucesso!', 'success');
        });
    }
    
    // Add smooth scrolling to all anchor links
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