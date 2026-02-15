// Sentinel Dashboard - Chart.js Implementation with Dynamic Data Loading

let dashboardData = null;

// Load data and initialize
async function loadAndInit() {
    try {
        const response = await fetch('./data.json');
        dashboardData = await response.json();
        initDashboard();
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to demo data if load fails
        initDashboard();
    }
}

// Initialize UI
function initDashboard() {
    if (!dashboardData) {
        // Demo data fallback
        dashboardData = {
            timestamp: new Date().toISOString(),
            threat_level: 'TIER 2',
            threat_description: 'ELEVATED — Multiple domains showing convergence',
            active_agents: 15,
            elevated_domains: 7,
            total_domains: 15,
            agents: [],
            key_developments: []
        };
    }
    
    // Set timestamp
    const timestamp = new Date(dashboardData.timestamp);
    document.getElementById('timestamp').textContent = 
        `${timestamp.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} — ${timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}`;
    
    // Set threat level
    const threatEl = document.getElementById('threatLevel');
    threatEl.textContent = dashboardData.threat_level;
    threatEl.className = 'threat-level';
    if (dashboardData.threat_level === 'TIER 1') threatEl.classList.add('tier-1');
    else if (dashboardData.threat_level === 'TIER 2') threatEl.classList.add('tier-2');
    else threatEl.classList.add('tier-3');
    
    document.getElementById('threatDescription').textContent = dashboardData.threat_description;
    
    // Set fleet metrics
    document.getElementById('activeAgents').textContent = `${dashboardData.active_agents}/${dashboardData.active_agents}`;
    document.getElementById('elevatedDomains').textContent = `${dashboardData.elevated_domains}/${dashboardData.total_domains}`;
    
    // Calculate time since last scan (from timestamp)
    const now = new Date();
    const scanTime = new Date(dashboardData.timestamp);
    const minutesAgo = Math.floor((now - scanTime) / 60000);
    document.getElementById('lastScan').textContent = minutesAgo < 1 ? 'Just now' : `${minutesAgo} min ago`;
    
    // Populate agent grid
    const grid = document.getElementById('agentGrid');
    grid.innerHTML = '';
    dashboardData.agents.forEach(agent => {
        const card = document.createElement('div');
        card.className = 'agent-card';
        card.innerHTML = `
            <div class="agent-name">${agent.name}</div>
            <div class="agent-status status-${agent.status}">${agent.tier}</div>
        `;
        grid.appendChild(card);
    });
    
    // Populate key developments
    const devsContainer = document.getElementById('keyDevelopments');
    devsContainer.innerHTML = '';
    dashboardData.key_developments.forEach(dev => {
        const devEl = document.createElement('div');
        devEl.className = 'metric-row';
        const priorityColor = dev.priority === 'critical' ? '#ef5350' : dev.priority === 'high' ? '#ffa726' : '#90caf9';
        devEl.innerHTML = `
            <span class="metric-label"><strong style="color: ${priorityColor}">${dev.domain}:</strong> ${dev.text}</span>
        `;
        devsContainer.appendChild(devEl);
    });
    
    // Initialize charts
    initPersianTrendChart();
    initMacroTrendChart();
    initConvergenceChart();
    initVelocityChart();
}

// Persian Watch 21-day trend
function initPersianTrendChart() {
    const ctx = document.getElementById('persianTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan 25', 'Jan 28', 'Jan 31', 'Feb 3', 'Feb 6', 'Feb 9', 'Feb 12', 'Feb 15'],
            datasets: [{
                label: 'Elevated Vectors',
                data: [3, 4, 5, 5, 4, 3, 2, 2],
                borderColor: '#ffa726',
                backgroundColor: 'rgba(255, 167, 38, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(22, 27, 46, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(66, 165, 245, 0.5)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    beginAtZero: true
                }
            }
        }
    });
}

// Macro Watch trend
function initMacroTrendChart() {
    const ctx = document.getElementById('macroTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan 25', 'Jan 28', 'Jan 31', 'Feb 3', 'Feb 6', 'Feb 9', 'Feb 12', 'Feb 15'],
            datasets: [
                {
                    label: 'BTC ($k)',
                    data: [68, 69, 67, 68, 70, 69.5, 70, 70.5],
                    borderColor: '#66bb6a',
                    tension: 0.4
                },
                {
                    label: 'VIX',
                    data: [21, 20, 19, 20, 21, 20.5, 20.8, 20.8],
                    borderColor: '#90caf9',
                    tension: 0.4
                },
                {
                    label: 'USD/JPY',
                    data: [154, 153.5, 153, 153.2, 153, 152.9, 152.9, 152.9],
                    borderColor: '#ffa726',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'rgba(255, 255, 255, 0.8)' }
                },
                tooltip: {
                    backgroundColor: 'rgba(22, 27, 46, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(66, 165, 245, 0.5)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                }
            }
        }
    });
}

// Domain convergence bar chart
function initConvergenceChart() {
    const ctx = document.getElementById('convergenceChart').getContext('2d');
    
    // Filter elevated agents for convergence display
    const elevatedAgents = dashboardData.agents
        .filter(a => a.status === 'amber' || a.status === 'red')
        .slice(0, 10);  // Top 10
    
    const labels = elevatedAgents.map(a => a.name.split(' ')[0]);
    const colors = elevatedAgents.map(a => 
        a.status === 'red' ? 'rgba(239, 83, 80, 0.6)' : 'rgba(255, 167, 38, 0.6)'
    );
    const borderColors = elevatedAgents.map(a => 
        a.status === 'red' ? '#ef5350' : '#ffa726'
    );
    
    // Demo drift percentages (in real version, would come from trend_analysis)
    const driftData = elevatedAgents.map((a, i) => {
        const baseDrift = {
            'Persian': 37.5, 'Threat': 9, 'FTO': 15, 'Domestic': 22,
            'Cyber': 18, 'Supply': 25, 'AI': 85
        };
        return baseDrift[a.name.split(' ')[0]] || 10;
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Baseline Drift %',
                data: driftData,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(22, 27, 46, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(66, 165, 245, 0.5)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    beginAtZero: true
                }
            }
        }
    });
}

// Threat velocity radar chart
function initVelocityChart() {
    const ctx = document.getElementById('velocityChart').getContext('2d');
    
    const elevatedAgents = dashboardData.agents
        .filter(a => a.status === 'amber' || a.status === 'red')
        .slice(0, 7);
    
    const labels = elevatedAgents.map(a => a.name.split(' ')[0]);
    const velocityData = elevatedAgents.map(a => {
        if (a.trend === 'up') return 0.7 + Math.random() * 0.3;
        if (a.trend === 'down') return 0.2 + Math.random() * 0.3;
        return 0.4 + Math.random() * 0.2;
    });
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Velocity Score',
                data: velocityData,
                backgroundColor: 'rgba(255, 167, 38, 0.2)',
                borderColor: '#ffa726',
                borderWidth: 2,
                pointBackgroundColor: '#ffa726',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#ffa726'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(22, 27, 46, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(66, 165, 245, 0.5)',
                    borderWidth: 1
                }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: 'rgba(255, 255, 255, 0.7)' },
                    ticks: { 
                        color: 'rgba(255, 255, 255, 0.5)',
                        backdropColor: 'transparent'
                    },
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', loadAndInit);

// Auto-refresh every 5 minutes
setInterval(() => {
    location.reload();
}, 5 * 60 * 1000);
