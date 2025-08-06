// 知识点页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 卡片悬停效果
    const cards = document.querySelectorAll('.overview-card, .point-card, .example-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 图片懒加载占位符点击效果
    const imagePlaceholders = document.querySelectorAll('.image-placeholder');
    imagePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.style.color = 'white';
            this.innerHTML = '<i class="fas fa-check"></i><p>图片加载中...</p>';
            
            setTimeout(() => {
                this.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
                this.style.color = '#6c757d';
                this.innerHTML = '<i class="fas fa-image"></i><p>' + this.querySelector('p').textContent + '</p>';
            }, 2000);
        });
    });

    // 滚动进度指示器
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // 返回顶部按钮
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    `;
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    // 互动练习答案检查功能
    window.checkAnswer = function(questionId, correctAnswer) {
        const selectedAnswer = document.querySelector(`input[name="${questionId}"]:checked`);
        const explanation = document.getElementById(`explanation-${questionId}`);
        
        if (!selectedAnswer) {
            alert('请先选择一个答案！');
            return;
        }
        
        if (selectedAnswer.value === correctAnswer) {
            explanation.style.display = 'block';
            explanation.style.background = '#e8f5e8';
            explanation.style.borderLeftColor = '#27ae60';
        } else {
            explanation.style.display = 'block';
            explanation.style.background = '#ffe6e6';
            explanation.style.borderLeftColor = '#e74c3c';
        }
    };

    // 3D模型控制功能
    window.rotateModel = function(direction) {
        const modelPlaceholder = document.querySelector('.model-placeholder');
        if (modelPlaceholder) {
            const currentRotation = modelPlaceholder.style.transform || 'rotateY(0deg)';
            const currentAngle = parseInt(currentRotation.match(/rotateY\(([-\d]+)deg\)/)?.[1] || 0);
            const newAngle = direction === 'left' ? currentAngle - 45 : currentAngle + 45;
            modelPlaceholder.style.transform = `rotateY(${newAngle}deg)`;
        }
    };

    window.zoomModel = function(direction) {
        const modelPlaceholder = document.querySelector('.model-placeholder');
        if (modelPlaceholder) {
            const currentScale = modelPlaceholder.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || 1;
            const newScale = direction === 'in' ? parseFloat(currentScale) * 1.2 : parseFloat(currentScale) / 1.2;
            modelPlaceholder.style.transform = `scale(${newScale})`;
        }
    };

    // 板块碰撞模拟功能
    let simulationPlaying = false;
    let simulationInterval;

    window.playSimulation = function() {
        if (!simulationPlaying) {
            simulationPlaying = true;
            const stages = document.querySelectorAll('.stage');
            let currentStage = 0;
            
            simulationInterval = setInterval(() => {
                stages.forEach((stage, index) => {
                    if (index === currentStage) {
                        stage.style.transform = 'scale(1.2)';
                        stage.style.background = '#3498db';
                    } else {
                        stage.style.transform = 'scale(1)';
                        stage.style.background = 'transparent';
                    }
                });
                
                currentStage = (currentStage + 1) % stages.length;
            }, 1000);
        }
    };

    window.pauseSimulation = function() {
        if (simulationPlaying) {
            simulationPlaying = false;
            clearInterval(simulationInterval);
        }
    };

    window.resetSimulation = function() {
        pauseSimulation();
        const stages = document.querySelectorAll('.stage');
        stages.forEach(stage => {
            stage.style.transform = 'scale(1)';
            stage.style.background = 'transparent';
        });
    };

    // 山地气候模拟功能
    window.updateClimate = function(altitude) {
        const altitudeValue = document.getElementById('altitude-value');
        const temperature = document.getElementById('temperature');
        const precipitation = document.getElementById('precipitation');
        const vegetation = document.getElementById('vegetation');
        
        altitudeValue.textContent = altitude + 'm';
        
        // 计算温度（每100m下降0.6°C）
        const baseTemp = 25;
        const tempDecrease = (altitude / 100) * 0.6;
        const newTemp = baseTemp - tempDecrease;
        temperature.textContent = newTemp.toFixed(1) + '°C';
        
        // 计算降水（简化模型）
        let newPrecipitation;
        if (altitude < 1000) {
            newPrecipitation = 1000 + (altitude * 0.5);
        } else if (altitude < 3000) {
            newPrecipitation = 1500 + (altitude - 1000) * 0.3;
        } else {
            newPrecipitation = 2100 - (altitude - 3000) * 0.2;
        }
        precipitation.textContent = Math.round(newPrecipitation) + 'mm';
        
        // 确定植被类型
        let newVegetation;
        if (altitude < 500) {
            newVegetation = '热带雨林';
        } else if (altitude < 1500) {
            newVegetation = '常绿阔叶林';
        } else if (altitude < 2500) {
            newVegetation = '落叶阔叶林';
        } else if (altitude < 3500) {
            newVegetation = '针叶林';
        } else if (altitude < 4500) {
            newVegetation = '高山草甸';
        } else {
            newVegetation = '冰雪带';
        }
        vegetation.textContent = newVegetation;
    };

    // 显微镜控制功能
    window.changeMagnification = function(magnification) {
        const microscopePlaceholder = document.querySelector('.microscope-placeholder');
        if (microscopePlaceholder) {
            const scale = magnification === '100x' ? 1 : magnification === '400x' ? 1.5 : 2;
            microscopePlaceholder.style.transform = `scale(${scale})`;
            
            // 更新按钮状态
            const buttons = document.querySelectorAll('.micro-btn');
            buttons.forEach(btn => {
                btn.style.background = btn.textContent.includes(magnification) ? '#138d75' : '#16a085';
            });
        }
    };

    // 学习进度更新功能
    window.updateProgress = function(chapterId, score) {
        const chapterItem = document.querySelector(`[data-chapter="${chapterId}"]`);
        if (chapterItem) {
            const scoreElement = chapterItem.querySelector('.chapter-score');
            scoreElement.textContent = score + '%';
            
            // 更新总体进度
            updateOverallProgress();
        }
    };

    // 更新总体进度
    function updateOverallProgress() {
        const chapters = document.querySelectorAll('.chapter-item');
        let totalScore = 0;
        let completedChapters = 0;
        
        chapters.forEach(chapter => {
            const score = parseInt(chapter.querySelector('.chapter-score').textContent);
            totalScore += score;
            if (score > 0) completedChapters++;
        });
        
        const averageScore = totalScore / chapters.length;
        const progressCircle = document.querySelector('.progress-circle circle:last-child');
        const progressPercentage = document.querySelector('.progress-percentage');
        
        if (progressCircle && progressPercentage) {
            const circumference = 2 * Math.PI * 40; // r=40
            const offset = circumference - (averageScore / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
            progressPercentage.textContent = Math.round(averageScore) + '%';
        }
    }

    // 成就解锁功能
    window.unlockAchievement = function(achievementId) {
        const achievement = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (achievement) {
            achievement.classList.remove('locked');
            achievement.classList.add('unlocked');
            
            // 显示成就解锁通知
            showAchievementNotification(achievementId);
        }
    };

    // 显示成就解锁通知
    function showAchievementNotification(achievementId) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <i class="fas fa-trophy"></i>
            <span>恭喜解锁新成就！</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(243, 156, 18, 0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // 讨论提交功能
    window.submitDiscussion = function() {
        const title = document.getElementById('discussion-title').value;
        const content = document.getElementById('discussion-content').value;
        
        if (!title || !content) {
            alert('请填写完整的讨论标题和内容！');
            return;
        }
        
        // 模拟提交讨论
        const discussionList = document.querySelector('.discussion-list');
        const newDiscussion = document.createElement('div');
        newDiscussion.className = 'discussion-item';
        newDiscussion.innerHTML = `
            <div class="discussion-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="discussion-content">
                <div class="discussion-header">
                    <span class="discussion-author">我</span>
                    <span class="discussion-time">刚刚</span>
                </div>
                <h4>${title}</h4>
                <p>${content}</p>
                <div class="discussion-actions">
                    <button class="action-btn"><i class="fas fa-thumbs-up"></i> 点赞 (0)</button>
                    <button class="action-btn"><i class="fas fa-comment"></i> 回复 (0)</button>
                    <button class="action-btn"><i class="fas fa-share"></i> 分享</button>
                </div>
            </div>
        `;
        
        discussionList.insertBefore(newDiscussion, discussionList.firstChild);
        
        // 清空表单
        document.getElementById('discussion-title').value = '';
        document.getElementById('discussion-content').value = '';
        
        alert('讨论发表成功！');
    };

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 内容区域动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.knowledge-overview, .detailed-content, .key-points, .examples');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});
