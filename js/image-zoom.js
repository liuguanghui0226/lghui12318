// 图片缩放功能
class ImageZoom {
    constructor() {
        this.currentScale = 1;
        this.minScale = 0.3;
        this.maxScale = 4;
        this.scaleStep = 0.2;
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.setupZoomControls(), 100);
            });
        } else {
            setTimeout(() => this.setupZoomControls(), 100);
        }
    }

    setupZoomControls() {
        // 为所有图片容器添加缩放控制
        const imageContainers = document.querySelectorAll('.image-container');
        console.log('Found image containers:', imageContainers.length);

        imageContainers.forEach((container, index) => {
            console.log('Setting up container', index, container);
            this.addZoomControls(container, index);
            this.setupMouseWheel(container);
            this.setupDragPan(container);
            this.setupTouchGestures(container);
            this.setupTrackpadGestures(container);

            // 强制居中 - 使用简单直接的方法
            this.forceCenter(container, index);
        });
    }

    forceCenter(container, index) {
        console.log('Force centering container', index);

        const centerNow = () => {
            // 设置固定的居中位置
            const targetScrollLeft = 800;
            const targetScrollTop = 600;

            container.scrollLeft = targetScrollLeft;
            container.scrollTop = targetScrollTop;

            console.log(`Container ${index} scroll set to:`, {
                scrollLeft: container.scrollLeft,
                scrollTop: container.scrollTop,
                clientWidth: container.clientWidth,
                clientHeight: container.clientHeight,
                scrollWidth: container.scrollWidth,
                scrollHeight: container.scrollHeight
            });
        };

        // 立即执行
        centerNow();

        // 多次重试确保生效
        setTimeout(centerNow, 10);
        setTimeout(centerNow, 50);
        setTimeout(centerNow, 100);
        setTimeout(centerNow, 200);
        setTimeout(centerNow, 500);
        setTimeout(centerNow, 1000);
    }

    addZoomControls(container, index) {
        // 创建缩放控制按钮
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'zoom-controls';
        controlsDiv.innerHTML = `
            <button class="zoom-btn zoom-in" data-container="${index}" title="放大">+</button>
            <button class="zoom-btn zoom-out" data-container="${index}" title="缩小">−</button>
            <button class="zoom-btn zoom-reset" data-container="${index}" title="重置">⌂</button>
        `;

        container.appendChild(controlsDiv);

        // 绑定按钮事件
        const zoomInBtn = controlsDiv.querySelector('.zoom-in');
        const zoomOutBtn = controlsDiv.querySelector('.zoom-out');
        const zoomResetBtn = controlsDiv.querySelector('.zoom-reset');

        zoomInBtn.addEventListener('click', () => this.zoomIn(container));
        zoomOutBtn.addEventListener('click', () => this.zoomOut(container));
        zoomResetBtn.addEventListener('click', () => this.resetZoom(container));
    }

    setupMouseWheel(container) {
        // 鼠标滚轮缩放 - 支持触摸板双指滑动
        container.addEventListener('wheel', (e) => {
            // 检查是否是缩放手势（通常ctrlKey为true或者deltaY的绝对值较大）
            if (e.ctrlKey || Math.abs(e.deltaY) > 50) {
                e.preventDefault();

                if (e.deltaY < 0) {
                    this.zoomIn(container);
                } else {
                    this.zoomOut(container);
                }
            }
            // 否则允许正常滚动
        }, { passive: false });
    }

    setupTouchGestures(container) {
        let initialDistance = 0;
        let initialScale = 1;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                initialScale = this.currentScale;
            }
        }, { passive: false });

        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                const scaleChange = currentDistance / initialDistance;
                const newScale = Math.max(this.minScale, Math.min(this.maxScale, initialScale * scaleChange));

                this.currentScale = newScale;
                const svg = container.querySelector('svg');
                if (svg) {
                    this.applyZoom(svg);
                }
            }
        }, { passive: false });
    }

    setupTrackpadGestures(container) {
        // 专门处理触摸板的双指缩放手势
        let lastWheelTime = 0;
        let wheelDeltaY = 0;

        container.addEventListener('wheel', (e) => {
            const now = Date.now();

            // 检测快速连续的wheel事件（通常是触摸板双指手势）
            if (now - lastWheelTime < 50) {
                wheelDeltaY += e.deltaY;

                // 如果累积的deltaY足够大，认为是缩放手势
                if (Math.abs(wheelDeltaY) > 100) {
                    e.preventDefault();

                    if (wheelDeltaY < 0) {
                        this.zoomIn(container);
                    } else {
                        this.zoomOut(container);
                    }

                    wheelDeltaY = 0; // 重置累积值
                }
            } else {
                wheelDeltaY = e.deltaY;
            }

            lastWheelTime = now;
        }, { passive: false });

        // 监听gesturestart和gesturechange事件（Safari支持）
        container.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        }, { passive: false });

        container.addEventListener('gesturechange', (e) => {
            e.preventDefault();

            const scale = e.scale;
            if (scale > 1.1) {
                this.zoomIn(container);
            } else if (scale < 0.9) {
                this.zoomOut(container);
            }
        }, { passive: false });
    }

    centerImage(container) {
        // 简化的居中方法
        console.log('centerImage called for container:', container);

        // 设置固定的居中位置
        const targetScrollLeft = 800;
        const targetScrollTop = 600;

        container.scrollLeft = targetScrollLeft;
        container.scrollTop = targetScrollTop;

        console.log('centerImage result:', {
            scrollLeft: container.scrollLeft,
            scrollTop: container.scrollTop,
            targetScrollLeft,
            targetScrollTop
        });
    }

    setupDragPan(container) {
        let isDragging = false;
        let startX, startY, scrollLeft, scrollTop;

        const svg = container.querySelector('svg');
        if (!svg) return;

        svg.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - container.offsetLeft;
            startY = e.pageY - container.offsetTop;
            scrollLeft = container.scrollLeft;
            scrollTop = container.scrollTop;
            svg.style.cursor = 'grabbing';
        });

        container.addEventListener('mouseleave', () => {
            isDragging = false;
            svg.style.cursor = 'grab';
        });

        container.addEventListener('mouseup', () => {
            isDragging = false;
            svg.style.cursor = 'grab';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const x = e.pageX - container.offsetLeft;
            const y = e.pageY - container.offsetTop;
            const walkX = (x - startX) * 2;
            const walkY = (y - startY) * 2;
            
            container.scrollLeft = scrollLeft - walkX;
            container.scrollTop = scrollTop - walkY;
        });
    }

    zoomIn(container) {
        const svg = container.querySelector('svg');
        if (!svg) return;

        if (this.currentScale < this.maxScale) {
            this.currentScale += this.scaleStep;
            this.applyZoom(svg);
        }
    }

    zoomOut(container) {
        const svg = container.querySelector('svg');
        if (!svg) return;

        if (this.currentScale > this.minScale) {
            this.currentScale -= this.scaleStep;
            this.applyZoom(svg);
        }
    }

    resetZoom(container) {
        const svg = container.querySelector('svg');
        if (!svg) return;

        this.currentScale = 1;
        this.applyZoom(svg);

        // 重置滚动位置到中心
        setTimeout(() => {
            this.centerImage(container);
        }, 100);
    }

    applyZoom(svg) {
        svg.style.transform = `scale(${this.currentScale})`;
        
        // 更新光标样式
        if (this.currentScale > 1) {
            svg.style.cursor = 'grab';
        } else {
            svg.style.cursor = 'default';
        }
    }
}

// 立即强制居中所有容器
function forceAllContainersCenter() {
    const containers = document.querySelectorAll('.image-container');
    console.log('Force centering all containers:', containers.length);

    containers.forEach((container, index) => {
        console.log(`Centering container ${index}`);
        container.scrollLeft = 800;
        container.scrollTop = 600;

        console.log(`Container ${index} after centering:`, {
            scrollLeft: container.scrollLeft,
            scrollTop: container.scrollTop
        });
    });
}

// 立即执行一次
forceAllContainersCenter();

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, centering containers');
    forceAllContainersCenter();

    setTimeout(forceAllContainersCenter, 100);
    setTimeout(forceAllContainersCenter, 300);
    setTimeout(forceAllContainersCenter, 500);
});

// 页面完全加载后执行
window.addEventListener('load', () => {
    console.log('Window loaded, centering containers');
    forceAllContainersCenter();

    setTimeout(forceAllContainersCenter, 100);
    setTimeout(forceAllContainersCenter, 500);
    setTimeout(forceAllContainersCenter, 1000);
});

// 初始化图片缩放功能
const imageZoom = new ImageZoom();
