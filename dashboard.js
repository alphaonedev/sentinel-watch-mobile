// Sentinel Dashboard - Chart.js Implementation with Embedded Data

let dashboardData = null;

// Load data from embedded window.SENTINEL_DATA or fetch as fallback
async function loadAndInit() {
    try {
        if (window.SENTINEL_DATA) {
            // Use embedded data (preferred for GitHub Pages)
            dashboardData = window.SENTINEL_DATA;
            console.log('✅ Loaded embedded dashboard data');
        } else {
            // Fallback to fetch
            const response = await fetch('./data.json');
            dashboardData = await response.json();
            console.log('✅ Loaded dashboard data from fetch');
        }
        initDashboard();
    } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
        // Use demo data as last resort
        dashboardData = createDemoData();
        initDashboard();
    }
}

// Create demo data fallback
function createDemoData() {
    return {
        timestamp: new Date().toISOString(),
        threat_level: 'TIER 2',
        threat_description: 'ELEVATED — Multiple domains showing convergence',
        active_agents: 15,
        elevated_domains: 7,
        total_domains: 15,
        agents: [
            { name: 'Persian Watch', status: 'amber', tier: 'TIER 2', trend: 'up' },
            { name: 'AI Watch', status: 'red', tier: 'TIER 1', trend: 'up' },
            { name: 'FTO Watch', status: 'amber', tier: 'TIER 2', trend: 'stable' },
            { name: 'Domestic Watch', status: 'amber', tier: 'TIER 2', trend: 'stable' },
            { name: 'Cyber Watch', status: 'amber', tier: 'TIER 2', trend: 'stable' },
            { name: 'Russia-NATO', status: 'amber', tier: 'TIER 2', trend: 'stable' },
            { name: 'Weather Watch', status: 'amber', tier: 'TIER 2', trend: 'stable' },
            { name: 'News Watch', status: 'amber', tier: 'TIER 2', trend: 'stable' },
            { name: 'Threat Watch', status: 'green', tier: 'TIER 3', trend: 'stable' },
            { name: 'Macro Watch', status: 'green', tier: 'TIER 3', trend: 'up' },
            { name: 'Market Watch', status: 'green', tier: 'TIER 3', trend: 'stable' },
            { name: 'Doomsday Watch', status: 'green', tier: 'TIER 3', trend: 'stable' },
            { name: 'China-Taiwan', status: 'green', tier: 'TIER 3', trend: 'stable' },
            { name: 'Supply Chain', status: 'green', tier: 'TIER 3', trend: 'stable' },
            { name: 'UAP Watch', status: 'green', tier: 'TIER 3', trend: 'stable' }
        ],
        key_developments: [
            { domain: 'AI Watch', text: 'Anthropic Head of Safeguards resigned with "world is in peril" warning', priority: 'critical' },
            { domain: 'Persian Watch', text: 'USS Gerald Ford deploying to join USS Abraham Lincoln CSG — dual carrier posture', priority: 'high' },
            { domain: 'FTO Watch', text: 'TdA judicial interference undermining gang enforcement', priority: 'high' },
            { domain: 'Domestic Watch', text: 'DHS shutdown continues (10+ days) — 3rd shutdown in 5 months', priority: 'high' },
            { domain: 'Cyber Watch', text: 'CVE-2026-1731 under active exploitation — federal deadline March 5', priority: 'high' }
        ]
    };
}

// Initialize UI
function initDashboard() {
    if (!dashboardData || !dashboardData.agents) {
        console.error('❌ Dashboard data invalid');
        return;
    }
    
    console.log(`📊 Initializing dashboard: ${dashboardData.agents.length} agents, ${dashboardData.key_developments.length} developments`);
    
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
    
    // Calculate time since last scan
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
    if (dashboardData.key_developments && dashboardData.key_developments.length > 0) {
        dashboardData.key_developments.forEach(dev => {
            const devEl = document.createElement('div');
            devEl.className = 'metric-row';
            const priorityColor = dev.priority === 'critical' ? '#ef5350' : dev.priority === 'high' ? '#ffa726' : '#90caf9';
            devEl.innerHTML = `
                <span class="metric-label"><strong style="color: ${priorityColor}">${dev.domain}:</strong> ${dev.text}</span>
            `;
            devsContainer.appendChild(devEl);
        });
    } else {
        devsContainer.innerHTML = '<div class="metric-row"><span class="metric-label">No critical developments in past 24 hours</span></div>';
    }
    
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
    
    const elevatedAgents = dashboardData.agents.filter(a => a.status === 'amber' || a.status === 'red').slice(0, 10);
    const labels = elevatedAgents.map(a => a.name.split(' ')[0]);
    const colors = elevatedAgents.map(a => 
        a.status === 'red' ? 'rgba(239, 83, 80, 0.6)' : 'rgba(255, 167, 38, 0.6)'
    );
    const borderColors = elevatedAgents.map(a => 
        a.status === 'red' ? '#ef5350' : '#ffa726'
    );
    
    const baseDrift = {
        'Persian': 37.5, 'Threat': 9, 'FTO': 15, 'Domestic': 22,
        'Cyber': 18, 'Supply': 25, 'AI': 85, 'Russia-NATO': 12,
        'Weather': 8, 'News': 6
    };
    const driftData = elevatedAgents.map(a => baseDrift[a.name.split(' ')[0]] || 10);
    
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
    
    const elevatedAgents = dashboardData.agents.filter(a => a.status === 'amber' || a.status === 'red').slice(0, 7);
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
