// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有模块
    initStarsBackground();
    initPlanet();
    initNavigation();
    initDataStream();
    initProjects();
    initSkills();
    initTerminal();
    initDateTime();
    initStatusBars();
    initCursorTrail();
    initSoundEffects();
    initThemeToggle();
    initWarpDrive();
    
    // 初始显示仪表盘
    showSection('dashboard');
    
    console.log('NEBULA-DASH 系统初始化完成');
});

// 1. 星空背景粒子效果
function initStarsBackground() {
    const canvas = document.getElementById('starsCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 创建粒子
    const particles = [];
    const particleCount = 150;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
            this.glow = Math.random() > 0.8;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 边界处理
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
            
            // 鼠标互动
            const mouseX = window.mouseX || 0;
            const mouseY = window.mouseY || 0;
            
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            if (this.glow) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'white';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
    
    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // 跟踪鼠标位置
    window.mouseX = canvas.width / 2;
    window.mouseY = canvas.height / 2;
    
    canvas.addEventListener('mousemove', (e) => {
        window.mouseX = e.x;
        window.mouseY = e.y;
    });
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制星空背景渐变
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 1.5
        );
        gradient.addColorStop(0, 'rgba(10, 14, 23, 0.1)');
        gradient.addColorStop(1, 'rgba(5, 8, 17, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 更新和绘制粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw();
            
            // 绘制粒子间的连线
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.2 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// 2. 3D星球效果
function initPlanet() {
    const canvas = document.getElementById('planetCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 400;
    
    let rotation = 0;
    const rings = 3;
    
    function drawPlanet() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        
        // 绘制星球
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, '#00f3ff');
        gradient.addColorStop(0.5, '#0066ff');
        gradient.addColorStop(1, '#000066');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 绘制星球纹理
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius * 0.8;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const size = Math.random() * 10 + 2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
            ctx.fill();
        }
        
        // 绘制行星环
        for (let r = 0; r < rings; r++) {
            const ringRadius = radius + 30 + r * 25;
            const ringWidth = 10;
            
            ctx.beginPath();
            ctx.ellipse(
                centerX, centerY,
                ringRadius, ringRadius * 0.1,
                rotation + r * 0.5, 0, Math.PI * 2
            );
            ctx.strokeStyle = `rgba(157, 0, 255, ${0.3 + r * 0.1})`;
            ctx.lineWidth = ringWidth;
            ctx.stroke();
            
            // 环上的纹理
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + rotation;
                const x = centerX + Math.cos(angle) * ringRadius;
                const y = centerY + Math.sin(angle) * ringRadius * 0.1;
                
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.5})`;
                ctx.fill();
            }
        }
        
        // 绘制光晕
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(
            centerX, centerY, radius,
            centerX, centerY, radius + 30
        );
        glowGradient.addColorStop(0, 'rgba(0, 243, 255, 0.5)');
        glowGradient.addColorStop(1, 'rgba(0, 243, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        rotation += 0.005;
        requestAnimationFrame(drawPlanet);
    }
    
    // 星球扫描效果
    document.getElementById('scanPlanet').addEventListener('click', function() {
        const scanBtn = this;
        const originalText = scanBtn.innerHTML;
        
        scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 扫描中...';
        scanBtn.disabled = true;
        
        // 添加扫描动画
        const scanCanvas = document.createElement('canvas');
        scanCanvas.width = canvas.width;
        scanCanvas.height = canvas.height;
        scanCanvas.style.position = 'absolute';
        scanCanvas.style.top = '0';
        scanCanvas.style.left = '0';
        canvas.parentNode.appendChild(scanCanvas);
        
        const scanCtx = scanCanvas.getContext('2d');
        let scanY = 0;
        
        function scanAnimation() {
            scanCtx.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
            
            // 绘制扫描线
            scanCtx.beginPath();
            scanCtx.rect(0, scanY, scanCanvas.width, 20);
            const scanGradient = scanCtx.createLinearGradient(0, scanY, 0, scanY + 20);
            scanGradient.addColorStop(0, 'rgba(0, 243, 255, 0)');
            scanGradient.addColorStop(0.5, 'rgba(0, 243, 255, 0.5)');
            scanGradient.addColorStop(1, 'rgba(0, 243, 255, 0)');
            scanCtx.fillStyle = scanGradient;
            scanCtx.fill();
            
            scanY += 2;
            
            if (scanY < scanCanvas.height) {
                requestAnimationFrame(scanAnimation);
            } else {
                scanCanvas.remove();
                scanBtn.innerHTML = originalText;
                scanBtn.disabled = false;
                
                // 显示扫描结果
                const streamContainer = document.querySelector('.stream-container');
                const newLine = document.createElement('div');
                newLine.className = 'stream-line';
                newLine.textContent = `> 星球扫描完成: 发现${Math.floor(Math.random() * 5) + 3}个新资源点`;
                streamContainer.appendChild(newLine);
                streamContainer.scrollTop = streamContainer.scrollHeight;
            }
        }
        
        scanAnimation();
    });
    
    drawPlanet();
}

// 3. 导航系统
function initNavigation() {
    // 顶部导航
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            // 更新活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应部分
            showSection(sectionId);
            
            // 播放声音
            playSound('click');
        });
    });
    
    // 快速导航按钮
    const navButtons = document.querySelectorAll('.nav-button[data-target]');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            
            // 更新顶部导航状态
            navLinks.forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('data-section') === targetSection) {
                    l.classList.add('active');
                }
            });
            
            // 显示对应部分
            showSection(targetSection);
            
            // 播放声音
            playSound('click');
        });
    });
}

function showSection(sectionId) {
    // 隐藏所有部分
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示目标部分
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 更新URL哈希
    window.location.hash = sectionId;
}

// 4. 数据流效果
function initDataStream() {
    const streamContainer = document.querySelector('.stream-container');
    const streamTime = document.getElementById('streamTime');
    
    // 初始数据流
    const initialMessages = [
        "> 量子处理器运行正常",
        "> 星图数据库已同步",
        "> 网络延迟: 12ms",
        "> 系统温度: 34°C",
        "> 能量核心输出稳定",
        "> 防御屏障激活",
        "> 导航系统在线"
    ];
    
    // 添加初始消息
    initialMessages.forEach((message, index) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'stream-line';
            line.textContent = message;
            streamContainer.appendChild(line);
            streamContainer.scrollTop = streamContainer.scrollHeight;
        }, index * 800);
    });
    
    // 更新流时间
    function updateStreamTime() {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        streamTime.textContent = timeString;
    }
    
    updateStreamTime();
    setInterval(updateStreamTime, 1000);
    
    // 数据流速度控制
    const streamButtons = document.querySelectorAll('.stream-btn');
    streamButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 更新按钮状态
            streamButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 获取速度设置
            const speed = this.getAttribute('data-speed');
            let interval;
            
            switch(speed) {
                case 'slow': interval = 5000; break;
                case 'medium': interval = 3000; break;
                case 'fast': interval = 1000; break;
            }
            
            // 清除现有定时器
            if (window.streamInterval) {
                clearInterval(window.streamInterval);
            }
            
            // 设置新定时器
            window.streamInterval = setInterval(() => {
                const messages = [
                    "> 处理传感器数据",
                    "> 优化轨道计算",
                    "> 更新星图坐标",
                    "> 扫描附近空间",
                    "> 同步数据库",
                    "> 检查系统完整性",
                    "> 监控能量波动"
                ];
                
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                const line = document.createElement('div');
                line.className = 'stream-line';
                line.textContent = randomMessage;
                streamContainer.appendChild(line);
                
                // 限制消息数量
                if (streamContainer.children.length > 15) {
                    streamContainer.removeChild(streamContainer.children[0]);
                }
                
                streamContainer.scrollTop = streamContainer.scrollHeight;
            }, interval);
        });
    });
    
    // 启动默认速度
    document.querySelector('.stream-btn.active').click();
}

// 5. 项目空间站
function initProjects() {
    const projectsContainer = document.getElementById('projectsContainer');
    
    const projects = [
        {
            id: 1,
            name: "量子引擎模拟器",
            icon: "fas fa-rocket",
            description: "模拟超光速旅行的量子引擎，实现曲速推进计算",
            status: "active",
            tech: ["React", "Three.js", "WebGL", "Node.js"],
            progress: 85
        },
        {
            id: 2,
            name: "星图导航系统",
            icon: "fas fa-map",
            description: "交互式3D星图，实时显示已知星系和空间站",
            status: "active",
            tech: ["Vue.js", "D3.js", "WebSocket", "MongoDB"],
            progress: 70
        },
        {
            id: 3,
            name: "AI防御矩阵",
            icon: "fas fa-shield-alt",
            description: "基于机器学习的空间防御系统，自动识别威胁",
            status: "development",
            tech: ["Python", "TensorFlow", "FastAPI", "Redis"],
            progress: 45
        },
        {
            id: 4,
            name: "全息通讯协议",
            icon: "fas fa-broadcast-tower",
            description: "实现零延迟的全息视频通讯，突破物理限制",
            status: "active",
            tech: ["WebRTC", "WebGL", "WebAssembly", "Go"],
            progress: 60
        },
        {
            id: 5,
            name: "能量核心监控",
            icon: "fas fa-bolt",
            description: "实时监控和优化能量核心输出，确保系统稳定",
            status: "active",
            tech: ["Electron", "D3.js", "WebSocket", "SQLite"],
            progress: 90
        },
        {
            id: 6,
            name: "空间站自动化",
            icon: "fas fa-robot",
            description: "自动化空间站日常维护和资源管理",
            status: "development",
            tech: ["Python", "ROS", "IoT", "PostgreSQL"],
            progress: 30
        }
    ];
    
    // 渲染项目卡片
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-header">
                <h3><i class="${project.icon}"></i> ${project.name}</h3>
                <span class="project-status status-${project.status}">
                    ${project.status === 'active' ? '运行中' : '开发中'}
                </span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-progress">
                <div class="progress-bar">
                    <div class="progress-fill" data-value="${project.progress}"></div>
                </div>
                <div class="progress-text">
                    <span>完成度</span>
                    <span>${project.progress}%</span>
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
        
        // 延迟设置进度条宽度，用于动画
        setTimeout(() => {
            const progressFill = projectCard.querySelector('.progress-fill');
            progressFill.style.width = `${project.progress}%`;
        }, 100);
    });
}

// 6. 技能矩阵
function initSkills() {
    const skillsList = document.getElementById('skillsList');
    
    const skills = [
        { name: "量子计算", level: 90 },
        { name: "人工智能", level: 85 },
        { name: "全栈开发", level: 95 },
        { name: "3D图形学", level: 80 },
        { name: "数据分析", level: 75 },
        { name: "网络安全", level: 88 },
        { name: "系统架构", level: 92 },
        { name: "DevOps", level: 78 }
    ];
    
    // 渲染技能列表
    skills.forEach(skill => {
        const skillItem = document.createElement('li');
        
        skillItem.innerHTML = `
            <span class="skill-name">${skill.name}</span>
            <div class="skill-level">
                <div class="level-bar">
                    <div class="level-fill" data-value="${skill.level}"></div>
                </div>
                <span class="level-value">${skill.level}%</span>
            </div>
        `;
        
        skillsList.appendChild(skillItem);
        
        // 延迟设置进度条宽度，用于动画
        setTimeout(() => {
            const levelFill = skillItem.querySelector('.level-fill');
            levelFill.style.width = `${skill.level}%`;
        }, 100);
    });
    
    // 绘制技能雷达图
    const canvas = document.getElementById('skillsCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    canvas.width = 500;
    canvas.height = 500;
    
    // 技能数据（与列表对应）
    const skillData = skills.map(skill => skill.level / 100);
    const skillNames = skills.map(skill => skill.name);
    const numSkills = skillData.length;
    
    // 绘制雷达图
    function drawRadarChart() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制网格线
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 1; i <= 5; i++) {
            const r = radius * (i / 5);
            ctx.beginPath();
            
            for (let j = 0; j < numSkills; j++) {
                const angle = (Math.PI * 2 * j / numSkills) - Math.PI / 2;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.stroke();
        }
        
        // 绘制轴线
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < numSkills; i++) {
            const angle = (Math.PI * 2 * i / numSkills) - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // 绘制技能名称
            const textX = centerX + Math.cos(angle) * (radius + 30);
            const textY = centerY + Math.sin(angle) * (radius + 30);
            
            ctx.fillStyle = '#e0e0ff';
            ctx.font = '14px Exo 2';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(skillNames[i], textX, textY);
        }
        
        // 绘制数据区域
        ctx.fillStyle = 'rgba(0, 243, 255, 0.3)';
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.8)';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        
        for (let i = 0; i < numSkills; i++) {
            const angle = (Math.PI * 2 * i / numSkills) - Math.PI / 2;
            const value = skillData[i];
            const r = radius * value;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // 绘制数据点
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#00f3ff';
            ctx.fill();
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    // 绘制柱状图
    function drawBarChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = 40;
        const spacing = 20;
        const chartHeight = canvas.height * 0.7;
        const startX = 60;
        
        // 绘制坐标轴
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
        ctx.lineWidth = 2;
        
        // Y轴
        ctx.beginPath();
        ctx.moveTo(50, 30);
        ctx.lineTo(50, canvas.height - 50);
        ctx.stroke();
        
        // X轴
        ctx.beginPath();
        ctx.moveTo(50, canvas.height - 50);
        ctx.lineTo(canvas.width - 30, canvas.height - 50);
        ctx.stroke();
        
        // Y轴刻度
        ctx.fillStyle = '#e0e0ff';
        ctx.font = '12px Exo 2';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i <= 5; i++) {
            const y = canvas.height - 50 - (i * chartHeight / 5);
            const value = i * 20;
            
            ctx.beginPath();
            ctx.moveTo(45, y);
            ctx.lineTo(50, y);
            ctx.stroke();
            
            ctx.fillText(`${value}%`, 40, y);
        }
        
        // 绘制柱状图
        skillData.forEach((value, index) => {
            const x = startX + index * (barWidth + spacing);
            const barHeight = value * chartHeight;
            const y = canvas.height - 50 - barHeight;
            
            // 柱状图渐变
            const gradient = ctx.createLinearGradient(x, y, x, canvas.height - 50);
            gradient.addColorStop(0, '#00f3ff');
            gradient.addColorStop(1, '#0066ff');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // 柱状图边框
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, barWidth, barHeight);
            
            // 技能名称
            ctx.fillStyle = '#e0e0ff';
            ctx.font = '12px Exo 2';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(skillNames[index], x + barWidth / 2, canvas.height - 45);
            
            // 数值标签
            ctx.fillStyle = '#00f3ff';
            ctx.font = 'bold 14px Exo 2';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`${Math.round(value * 100)}%`, x + barWidth / 2, y - 5);
        });
    }
    
    // 初始绘制雷达图
    drawRadarChart();
    
    // 图表切换
    const matrixButtons = document.querySelectorAll('.matrix-btn');
    matrixButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 更新按钮状态
            matrixButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 根据视图类型绘制图表
            const viewType = this.getAttribute('data-view');
            
            if (viewType === 'radar') {
                drawRadarChart();
            } else if (viewType === 'bars') {
                drawBarChart();
            }
            
            // 播放声音
            playSound('click');
        });
    });
}

// 7. 终端控制台
function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const executeButton = document.getElementById('executeCommand');
    const clearButton = document.getElementById('clearTerminal');
    const fullscreenButton = document.getElementById('fullscreenTerminal');
    const terminalTabs = document.querySelectorAll('.tab');
    
    // 命令历史
    let commandHistory = [];
    let historyIndex = -1;
    
    // 可用命令
    const commands = {
        help: {
            description: "显示所有可用命令",
            execute: () => {
                addOutputLine("可用命令:");
                Object.keys(commands).forEach(cmd => {
                    addOutputLine(`  ${cmd} - ${commands[cmd].description}`);
                });
                addOutputLine("提示: 使用 'clear' 清屏，'history' 查看命令历史");
            }
        },
        clear: {
            description: "清空终端输出",
            execute: () => {
                terminalOutput.innerHTML = '<div class="output-line">终端已清空</div><div class="output-line">> </div>';
            }
        },
        history: {
            description: "显示命令历史",
            execute: () => {
                if (commandHistory.length === 0) {
                    addOutputLine("命令历史为空");
                } else {
                    addOutputLine("命令历史:");
                    commandHistory.forEach((cmd, index) => {
                        addOutputLine(`  ${index + 1}: ${cmd}`);
                    });
                }
            }
        },
        date: {
            description: "显示当前日期和时间",
            execute: () => {
                const now = new Date();
                addOutputLine(`当前时间: ${now.toLocaleString()}`);
            }
        },
        system: {
            description: "显示系统信息",
            execute: () => {
                addOutputLine("系统信息:");
                addOutputLine(`  用户代理: ${navigator.userAgent}`);
                addOutputLine(`  平台: ${navigator.platform}`);
                addOutputLine(`  语言: ${navigator.language}`);
                addOutputLine(`  在线状态: ${navigator.onLine ? '在线' : '离线'}`);
                addOutputLine(`  屏幕分辨率: ${window.screen.width}x${window.screen.height}`);
            }
        },
        theme: {
            description: "切换主题 (light/dark/cyber)",
            execute: (args) => {
                if (args.length === 0) {
                    addOutputLine("用法: theme [light|dark|cyber]");
                    addOutputLine("当前主题: cyber");
                } else {
                    const theme = args[0].toLowerCase();
                    addOutputLine(`切换主题到: ${theme}`);
                    // 这里可以添加实际切换主题的代码
                }
            }
        },
        scan: {
            description: "执行系统扫描",
            execute: () => {
                addOutputLine("开始系统扫描...");
                
                const scans = [
                    "检查量子处理器... ✓",
                    "分析能量核心... ✓",
                    "测试防御屏障... ✓",
                    "验证通讯协议... ✓",
                    "扫描附近空间... ✓",
                    "检查导航系统... ✓"
                ];
                
                scans.forEach((scan, index) => {
                    setTimeout(() => {
                        addOutputLine(scan);
                        
                        if (index === scans.length - 1) {
                            addOutputLine("系统扫描完成: 所有系统正常");
                        }
                    }, index * 300);
                });
            }
        },
        reboot: {
            description: "重启系统 (模拟)",
            execute: () => {
                addOutputLine("开始系统重启...");
                
                setTimeout(() => {
                    terminalOutput.innerHTML = '<div class="output-line">系统重启中...</div>';
                }, 500);
                
                setTimeout(() => {
                    terminalOutput.innerHTML = '<div class="output-line">NEBULA-DASH 系统 v2.1.4</div>';
                    addOutputLine("> 系统重启完成");
                    addOutputLine("> 所有服务已恢复");
                    addOutputLine("> 输入 'help' 查看可用命令");
                    addOutputLine("> ");
                }, 2000);
            }
        },
        echo: {
            description: "回显输入的内容",
            execute: (args) => {
                if (args.length === 0) {
                    addOutputLine("用法: echo [文本]");
                } else {
                    addOutputLine(args.join(' '));
                }
            }
        },
        neofetch: {
            description: "显示系统信息",
            execute: () => {
                addOutputLine("╭─────────────────────────────────────────────╮");
                addOutputLine("│                                             │");
                addOutputLine("│   ███╗   ██╗███████╗██████╗ ██╗   ██╗██╗    │");
                addOutputLine("│   ████╗  ██║██╔════╝██╔══██╗██║   ██║██║    │");
                addOutputLine("│   ██╔██╗ ██║█████╗  ██████╔╝██║   ██║██║    │");
                addOutputLine("│   ██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║██║    │");
                addOutputLine("│   ██║ ╚████║███████╗██████╔╝╚██████╔╝██║    │");
                addOutputLine("│   ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚═╝    │");
                addOutputLine("│                                             │");
                addOutputLine("╰─────────────────────────────────────────────╯");
                addOutputLine("OS: NEBULA-DASH Cyber System");
                addOutputLine("Kernel: Quantum 5.15.0");
                addOutputLine("Uptime: 14 days, 7 hours, 32 mins");
                addOutputLine("Shell: zsh 5.8");
                addOutputLine("CPU: Quantum Processor X-9000");
                addOutputLine("GPU: Neural Renderer RTX-Infinity");
                addOutputLine("Memory: 128TB / 256TB");
            }
        }
    };
    
    // 添加输出行
    function addOutputLine(text) {
        const line = document.createElement('div');
        line.className = 'output-line';
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    // 执行命令
    function executeCommand(input) {
        // 添加命令到历史
        commandHistory.push(input);
        historyIndex = commandHistory.length;
        
        // 显示输入的命令
        addOutputLine(`nebula@terminal:~$ ${input}`);
        
        // 解析命令
        const parts = input.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // 执行命令
        if (commands[command]) {
            try {
                commands[command].execute(args);
            } catch (error) {
                addOutputLine(`错误: ${error.message}`);
            }
        } else if (command) {
            addOutputLine(`命令未找到: ${command}`);
            addOutputLine("输入 'help' 查看可用命令");
        }
        
        // 添加新的提示符
        addOutputLine("> ");
    }
    
    // 输入事件
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim();
            if (input) {
                executeCommand(input);
                terminalInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            // 上箭头：历史命令上一条
            if (commandHistory.length > 0) {
                if (historyIndex > 0) {
                    historyIndex--;
                }
                terminalInput.value = commandHistory[historyIndex] || '';
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            // 下箭头：历史命令下一条
            if (commandHistory.length > 0) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex] || '';
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            }
            e.preventDefault();
        }
    });
    
    // 执行按钮事件
    executeButton.addEventListener('click', () => {
        const input = terminalInput.value.trim();
        if (input) {
            executeCommand(input);
            terminalInput.value = '';
        }
    });
    
    // 清屏按钮事件
    clearButton.addEventListener('click', () => {
        terminalOutput.innerHTML = '<div class="output-line">终端已清空</div><div class="output-line">> </div>';
        playSound('click');
    });
    
    // 全屏按钮事件
    fullscreenButton.addEventListener('click', () => {
        const terminalContainer = document.querySelector('.terminal-container');
        
        if (!document.fullscreenElement) {
            if (terminalContainer.requestFullscreen) {
                terminalContainer.requestFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
            fullscreenButton.title = '退出全屏';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenButton.title = '全屏';
        }
        
        playSound('click');
    });
    
    // 标签页切换
    terminalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 更新标签页状态
            terminalTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            
            // 切换终端内容
            switch(tabId) {
                case 'main':
                    terminalOutput.innerHTML = `
                        <div class="output-line">NEBULA-DASH 终端 v2.1.4</div>
                        <div class="output-line">> 系统启动完成，所有服务运行正常</div>
                        <div class="output-line">> 最后登录: 今天 14:32:17</div>
                        <div class="output-line">> 输入 'help' 查看可用命令</div>
                        <div class="output-line">> </div>
                    `;
                    break;
                case 'system':
                    terminalOutput.innerHTML = `
                        <div class="output-line">=== 系统日志 ===</div>
                        <div class="output-line">[INFO] 系统启动时间: 2023-10-05 08:00:00</div>
                        <div class="output-line">[INFO] 量子处理器初始化完成</div>
                        <div class="output-line">[INFO] 能量核心输出稳定在97%</div>
                        <div class="output-line">[INFO] 防御屏障已激活</div>
                        <div class="output-line">[INFO] 网络连接正常，延迟12ms</div>
                        <div class="output-line">[INFO] 最后系统检查: 2023-10-19 14:30:00</div>
                        <div class="output-line">> </div>
                    `;
                    break;
                case 'network':
                    terminalOutput.innerHTML = `
                        <div class="output-line">=== 网络诊断 ===</div>
                        <div class="output-line">正在ping量子中继器...</div>
                        <div class="output-line">回复来自 192.168.1.1: 时间=2ms</div>
                        <div class="output-line">回复来自 192.168.1.2: 时间=3ms</div>
                        <div class="output-line">回复来自 192.168.1.3: 时间=1ms</div>
                        <div class="output-line">回复来自 192.168.1.4: 时间=4ms</div>
                        <div class="output-line">--- 统计 ---</div>
                        <div class="output-line">已发送: 4, 已接收: 4, 丢失: 0 (0% 丢失)</div>
                        <div class="output-line">往返时间: 最小=1ms, 最大=4ms, 平均=2.5ms</div>
                        <div class="output-line">> </div>
                    `;
                    break;
            }
            
            playSound('click');
        });
    });
    
    // 初始添加提示符
    addOutputLine("> ");
}

// 8. 日期和时间显示
function initDateTime() {
    const currentDate = document.getElementById('currentDate');
    const currentTime = document.getElementById('currentTime');
    const systemUptime = document.getElementById('systemUptime');
    
    function updateDateTime() {
        const now = new Date();
        
        // 更新日期
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDate.textContent = now.toLocaleDateString('zh-CN', options);
        
        // 更新时间
        const timeString = now.toTimeString().split(' ')[0];
        currentTime.textContent = timeString;
    }
    
    // 模拟系统运行时间
    function updateUptime() {
        // 模拟运行时间（14天7小时32分开始）
        let days = 14, hours = 7, minutes = 32;
        
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
            if (hours >= 24) {
                hours = 0;
                days++;
            }
        }
        
        systemUptime.textContent = `系统运行: ${days}天 ${hours}小时 ${minutes}分`;
    }
    
    updateDateTime();
    updateUptime();
    
    setInterval(updateDateTime, 1000);
    setInterval(updateUptime, 60000); // 每分钟更新一次
}

// 9. 状态条动画
function initStatusBars() {
    const statusFills = document.querySelectorAll('.status-fill[data-value]');
    
    statusFills.forEach(fill => {
        const value = parseInt(fill.getAttribute('data-value'));
        setTimeout(() => {
            fill.style.width = `${value}%`;
        }, 500);
    });
    
    // 更新访问者数量（模拟）
    const visitorCount = document.getElementById('visitorCount');
    let count = 142;
    
    setInterval(() => {
        // 随机增加或减少
        const change = Math.floor(Math.random() * 5) - 2;
        count = Math.max(100, count + change);
        visitorCount.textContent = count;
    }, 30000);
}

// 10. 鼠标轨迹效果
function initCursorTrail() {
    const cursorTrail = document.querySelector('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        // 缓动效果
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursorTrail.style.left = `${trailX}px`;
        cursorTrail.style.top = `${trailY}px`;
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
    
    // 鼠标点击效果
    document.addEventListener('click', (e) => {
        createExplosion(e.clientX, e.clientY);
    });
}

// 11. 粒子爆炸效果
function createExplosion(x, y) {
    const explosion = document.getElementById('explosion');
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    explosion.style.opacity = '1';
    
    // 创建粒子
    const particles = 20;
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = `hsl(${Math.random() * 60 + 180}, 100%, 60%)`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        
        document.body.appendChild(particle);
        
        // 动画
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        function animateParticle() {
            posX += vx;
            posY += vy;
            opacity -= 0.03;
            
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        animateParticle();
    }
    
    // 隐藏爆炸容器
    setTimeout(() => {
        explosion.style.opacity = '0';
    }, 300);
}

// 12. 声音效果
function initSoundEffects() {
    // 预加载声音
    const hoverSound = document.getElementById('hoverSound');
    const clickSound = document.getElementById('clickSound');
    
    // 播放声音函数
    window.playSound = function(type) {
        try {
            if (type === 'hover') {
                hoverSound.currentTime = 0;
                hoverSound.volume = 0.2;
                hoverSound.play();
            } else if (type === 'click') {
                clickSound.currentTime = 0;
                clickSound.volume = 0.3;
                clickSound.play();
            }
        } catch (error) {
            console.log('声音播放失败:', error);
        }
    };
    
    // 为交互元素添加声音
    const interactiveElements = document.querySelectorAll('button, .nav-link, .nav-button, .stream-btn, .matrix-btn, .tab');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            playSound('hover');
        });
        
        element.addEventListener('click', () => {
            playSound('click');
        });
    });
}

// 13. 主题切换
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    let currentTheme = 'cyber';
    
    themeToggle.addEventListener('click', () => {
        const themes = ['cyber', 'dark', 'light'];
        const themeNames = ['赛博', '暗黑', '明亮'];
        const themeIndex = themes.indexOf(currentTheme);
        const nextThemeIndex = (themeIndex + 1) % themes.length;
        currentTheme = themes[nextThemeIndex];
        
        // 更新按钮文本
        themeToggle.innerHTML = `<i class="fas fa-palette"></i> <span>${themeNames[nextThemeIndex]}主题</span>`;
        
        // 应用主题
        applyTheme(currentTheme);
        
        // 播放声音
        playSound('click');
        
        // 在终端显示消息
        if (document.querySelector('#terminal').classList.contains('active')) {
            const terminalOutput = document.getElementById('terminalOutput');
            const line = document.createElement('div');
            line.className = 'output-line';
            line.textContent = `> 主题已切换到: ${themeNames[nextThemeIndex]}`;
            terminalOutput.appendChild(line);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
    
    function applyTheme(theme) {
        const root = document.documentElement;
        
        switch(theme) {
            case 'dark':
                root.style.setProperty('--primary-color', '#00ff9d');
                root.style.setProperty('--secondary-color', '#00a8ff');
                root.style.setProperty('--accent-color', '#9c88ff');
                root.style.setProperty('--dark-bg', '#0c0c0c');
                root.style.setProperty('--darker-bg', '#050505');
                root.style.setProperty('--card-bg', rgba(20, 20, 20, 0.8));
                root.style.setProperty('--text-color', '#f5f5f5');
                root.style.setProperty('--text-secondary', '#aaaaaa');
                break;
            case 'light':
                root.style.setProperty('--primary-color', '#0066ff');
                root.style.setProperty('--secondary-color', '#ff3366');
                root.style.setProperty('--accent-color', '#00cc99');
                root.style.setProperty('--dark-bg', '#f5f7fa');
                root.style.setProperty('--darker-bg', '#e4e7ec');
                root.style.setProperty('--card-bg', rgba(255, 255, 255, 0.9));
                root.style.setProperty('--text-color', '#333333');
                root.style.setProperty('--text-secondary', '#666666');
                break;
            case 'cyber':
            default:
                root.style.setProperty('--primary-color', '#00f3ff');
                root.style.setProperty('--secondary-color', '#9d00ff');
                root.style.setProperty('--accent-color', '#ff00c8');
                root.style.setProperty('--dark-bg', '#0a0e17');
                root.style.setProperty('--darker-bg', '#050811');
                root.style.setProperty('--card-bg', rgba(16, 22, 36, 0.8));
                root.style.setProperty('--text-color', '#e0e0ff');
                root.style.setProperty('--text-secondary', '#8a8dff');
                break;
        }
    }
}

// 14. 曲速引擎效果
function initWarpDrive() {
    const warpButton = document.getElementById('activateWarp');
    const warpDriveBtn = document.getElementById('warpDrive');
    
    warpButton.addEventListener('click', activateWarpDrive);
    warpDriveBtn.addEventListener('click', activateWarpDrive);
    
    function activateWarpDrive() {
        const button = event.target.closest('button');
        const originalHTML = button.innerHTML;
        
        // 更新按钮状态
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>曲速引擎启动中...</span>';
        button.disabled = true;
        
        // 播放启动音效（使用现有的点击音效）
        playSound('click');
        
        // 创建曲速效果
        const warpEffect = document.createElement('div');
        warpEffect.style.position = 'fixed';
        warpEffect.style.top = '0';
        warpEffect.style.left = '0';
        warpEffect.style.width = '100%';
        warpEffect.style.height = '100%';
        warpEffect.style.background = 'radial-gradient(circle at center, transparent 30%, #00f3ff 70%, #9d00ff 100%)';
        warpEffect.style.opacity = '0';
        warpEffect.style.zIndex = '10001';
        warpEffect.style.pointerEvents = 'none';
        warpEffect.style.transition = 'opacity 1s';
        
        document.body.appendChild(warpEffect);
        
        // 启动动画
        setTimeout(() => {
            warpEffect.style.opacity = '0.7';
        }, 100);
        
        // 创建星星拉伸效果
        const starsCanvas = document.getElementById('starsCanvas');
        const originalParticles = window.starParticles || [];
        
        // 模拟曲速飞行的粒子效果
        let warpProgress = 0;
        
        function warpAnimation() {
            warpProgress += 0.02;
            
            // 更新曲速效果
            warpEffect.style.background = `radial-gradient(circle at center, transparent ${30 - warpProgress * 10}%, #00f3ff ${70 - warpProgress * 20}%, #9d00ff 100%)`;
            
            if (warpProgress < 1) {
                requestAnimationFrame(warpAnimation);
            } else {
                // 结束曲速效果
                setTimeout(() => {
                    warpEffect.style.opacity = '0';
                    
                    setTimeout(() => {
                        warpEffect.remove();
                        
                        // 恢复按钮状态
                        button.innerHTML = originalHTML;
                        button.disabled = false;
                        
                        // 更新按钮文本
                        if (button.id === 'activateWarp') {
                            button.innerHTML = '<i class="fas fa-forward"></i> <span>曲速引擎就绪</span>';
                            
                            // 3秒后恢复原始文本
                            setTimeout(() => {
                                button.innerHTML = '<i class="fas fa-forward"></i> <span>曲速引擎预热...</span>';
                            }, 3000);
                        }
                        
                        // 在终端显示消息
                        if (document.querySelector('#terminal').classList.contains('active')) {
                            const terminalOutput = document.getElementById('terminalOutput');
                            const line = document.createElement('div');
                            line.className = 'output-line';
                            line.textContent = '> 曲速飞行完成: 已抵达目标星域';
                            terminalOutput.appendChild(line);
                            terminalOutput.scrollTop = terminalOutput.scrollHeight;
                        } else {
                            // 在数据流中显示消息
                            const streamContainer = document.querySelector('.stream-container');
                            const line = document.createElement('div');
                            line.className = 'stream-line';
                            line.textContent = '> 曲速飞行完成: 已抵达目标星域';
                            streamContainer.appendChild(line);
                            streamContainer.scrollTop = streamContainer.scrollHeight;
                        }
                    }, 1000);
                }, 500);
            }
        }
        
        warpAnimation();
    }
}

// 15. 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl + ` 打开终端
    if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        
        // 切换到终端部分
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === 'terminal') {
                link.classList.add('active');
            }
        });
        
        showSection('terminal');
        
        // 聚焦到终端输入
        setTimeout(() => {
            document.getElementById('terminalInput').focus();
        }, 100);
    }
    
    // Ctrl + 1-4 切换部分
    if (e.ctrlKey && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        
        const sections = ['dashboard', 'projects', 'skills', 'terminal'];
        const index = parseInt(e.key) - 1;
        
        if (sections[index]) {
            // 更新导航
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sections[index]) {
                    link.classList.add('active');
                }
            });
            
            showSection(sections[index]);
        }
    }
    
    // ESC 键退出全屏
    if (e.key === 'Escape' && document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        
        const fullscreenButton = document.getElementById('fullscreenTerminal');
        if (fullscreenButton) {
            fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenButton.title = '全屏';
        }
    }
});

// 初始加载完成消息
console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   NEBULA-DASH 系统加载完成！                            ║
║                                                          ║
║   快捷键：                                              ║
║   Ctrl + \`     打开终端控制台                          ║
║   Ctrl + 1-4   切换仪表盘/项目/技能/终端               ║
║   ESC          退出全屏模式                            ║
║                                                          ║
║   提示：点击星球进行扫描，使用曲速引擎体验超光速飞行   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);