// Sentinel Dashboard - Chart.js Implementation

const agentData = [
    { name: 'Persian Watch', status: 'amber', tier: 'TIER 2', trend: 'up' },
    { name: 'Threat Watch', status: 'amber', tier: 'TIER 2', trend: 'up' },
    { name: 'Macro Watch', status: 'green', tier: 'TIER 3', trend: 'stable' },
    { name: 'Market Watch', status: 'green', tier: 'TIER 3', trend: 'stable' },
    { name: 'FTO Watch', status: 'amber', tier: 'TIER 2', trend: 'up' },
    { name: 'Domestic Watch', status: 'amber', tier: 'TIER 2', trend: 'up' },
    { name: 'Doomsday Watch', status: 'green', tier: 'TIER 3', trend: 'down' },
    { name: 'China-Taiwan', status: 'green', tier: 'TIER 3', trend: 'down' },
    { name: 'Russia-NATO', status: 'green', tier: 'TIER 3', trend: 'stable' },
    { name: 'Cyber Watch', status: 'amber', tier: 'TIER 2', trend: 'up' },
    { name: 'Supply Chain', status: 'amber', tier: 'TIER 2', trend: 'up' },
    { name: 'Weather Watch', status: 'green', tier: 'TIER 3', trend: 'stable' },
    { name: 'UAP Watch', status: 'green', tier: 'TIER 3', trend: 'stable' },
    { name: 'AI Watch', status: 'red', tier: 'TIER 1', trend: 'up' },
    { name: 'News Watch', status: 'amber', tier: 'TIER 2', trend: 'stable' }
];

const keyDevelopments = [
    { domain: 'Persian Watch', text: 'USS Gerald Ford deploying to join USS Abraham Lincoln CSG — dual carrier posture in Persian Gulf', priority: 'high' },
    { domain: 'FTO Watch', text: 'TdA judicial interference undermining gang enforcement — threat escalating to MEDIUM-HIGH', priority: 'high' },
    { domain: 'Domestic Watch', text: 'DHS shutdown continues (10+ days) — 3rd government shutdown in 5 months', priority: 'high' },
    { domain: 'Russia-NATO', text: 'Geneva peace talks scheduled next week — critical diplomatic window for Ukraine', priority: 'medium' },
    { domain: 'Supply Chain', text: 'Strait of Hormuz elevated threat — Iranian drone shot down near carrier', priority: 'high' },
    { domain: 'Cyber Watch', text: 'CVE-2026-1731 under active exploitation — federal deadline March 5', priority: 'high' },
    { domain: 'AI Watch', text: 'Anthropic Head of Safeguards resigned — "world is in peril" warning', priority: 'critical' }
];

// Initialize UI
function initDashboard() {
    // Set timestamp
    const now = new Date();
    document.getElementById('timestamp').textContent = 
        `Sunday, ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}`;
    
    // Set threat metrics
    document.getElementById('activeAgents').textContent = `${agentData.length}/${agentData.length}`;
    const elevated = agentData.filter(a => a.status === 'amber' || a.status === 'red').length;
    document.getElementById('elevatedDomains').textContent = `${elevated}/15`;
    
    // Populate agent grid
    const grid = document.getElementById('agentGrid');
    agentData.forEach(agent => {
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
    keyDevelopments.forEach(dev => {
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
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Persian', 'Threat', 'FTO', 'Domestic', 'Cyber', 'Supply', 'AI'],
            datasets: [{
                label: 'Baseline Drift %',
                data: [37.5, 9, 15, 22, 18, 25, 85],
                backgroundColor: [
                    'rgba(255, 167, 38, 0.6)',
                    'rgba(255, 167, 38, 0.6)',
                    'rgba(255, 167, 38, 0.6)',
                    'rgba(255, 167, 38, 0.6)',
                    'rgba(255, 167, 38, 0.6)',
                    'rgba(255, 167, 38, 0.6)',
                    'rgba(239, 83, 80, 0.6)'
                ],
                borderColor: [
                    '#ffa726', '#ffa726', '#ffa726', '#ffa726', '#ffa726', '#ffa726', '#ef5350'
                ],
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
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Persian', 'Macro', 'FTO', 'Domestic', 'Cyber', 'Supply', 'AI'],
            datasets: [{
                label: 'Velocity Score',
                data: [0.8, 0.3, 0.6, 0.7, 0.5, 0.7, 1.0],
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
window.addEventListener('DOMContentLoaded', initDashboard);

// Auto-refresh every 5 minutes
setInterval(() => {
    location.reload();
}, 5 * 60 * 1000);
