console.log('app.js loaded');
function initMasonry() {
    const grids = document.querySelectorAll('.grid');
    grids.forEach(grid => {
        new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const galleryGrid = document.getElementById('gallery-grid');
    const portfolioItems = document.querySelectorAll('#portfolio-grid .portfolio-item');
    const galleryItems = document.querySelectorAll('#gallery-grid .portfolio-item');
    const quoteContainer = document.getElementById('quote-container');
    const galleryQuoteContainer = document.getElementById('gallery-quote-container');
    const photoStackContainer = document.querySelector('.photo-stack-container');
    const wechatLink = document.getElementById('wechat-link');
    
    const quotes = [
        { text: "生活中最重要的不是处境，而是你对处境的态度。", author: "阿尔弗雷德·阿德勒" },
        { text: "人生就像一场旅行，不必在乎目的地，在乎的是沿途的风景以及看风景的心情。", author: "罗兰·巴特" },
        { text: "不要等待机会，而要创造机会。", author: "乔治·萧伯纳" },
        { text: "生命不是要超越别人，而是要超越自己。", author: "比尔·盖茨" },
        { text: "成功不是最终的，失败也不是致命的，重要的是继续前进的勇气。", author: "温斯顿·丘吉尔" }
    ];
    
    const emojis = ['🌸', '🌺', '🌻', '🌼', '🌷', '🍀', '🌿', '🍃', '🦆', '🐤', '🐥', '🐣'];
    
    function adjustLayout(items, grid, quoteContainer) {
        let fullWidthCount = 0;
        let lastFullWidthIndex = -1;
        let regularItems = [];

        // 第一遍遍历：标记宽图并记录最后一个宽图的位置，收集常规图片
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img.naturalWidth > 1280) {
                item.classList.add('full-width');
                fullWidthCount++;
                lastFullWidthIndex = index;
            } else {
                item.classList.remove('full-width');
                regularItems.push(item);
            }
        });

        // 移除名言容器
        if (quoteContainer) quoteContainer.remove();

        // 重新排列常规图片
        regularItems.forEach(item => {
            grid.appendChild(item);
        });

        // 如果常规图片数量为奇数，添加名言容器
        if (quoteContainer && regularItems.length % 2 !== 0) {
            grid.appendChild(quoteContainer);
            
            // 随机选择一条名言
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            const quoteText = quoteContainer.querySelector('p');
            const quoteAuthor = quoteContainer.querySelector('footer');
            quoteText.textContent = randomQuote.text;
            quoteAuthor.textContent = randomQuote.author;

            // 添加三个随机颜文字
            const emojiContainer = quoteContainer.querySelector('.emojis');
            emojiContainer.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                const emojiSpan = document.createElement('span');
                emojiSpan.textContent = randomEmoji;
                emojiSpan.classList.add('emoji-item');
                emojiContainer.appendChild(emojiSpan);
            }
        }
    }

    function adjustAllLayouts() {
        adjustLayout(portfolioItems, portfolioGrid, quoteContainer);
        adjustLayout(galleryItems, galleryGrid, galleryQuoteContainer);
    }

    function setupPhotoWall() {
        const allImages = [...portfolioItems, ...galleryItems];
        let largeImages = allImages.filter(item => {
            const img = item.querySelector('img');
            return img.naturalWidth > 1280;
        });

        // 随机打乱大图数组
        largeImages = shuffleArray(largeImages);

        // 选择前5张大图（如果不足5张，则使用所有可用的大图）
        largeImages = largeImages.slice(0, 5);

        // 如果大图不足5张，可以重复使用
        while (largeImages.length < 5) {
            largeImages = [...largeImages, ...largeImages];
        }
        largeImages = largeImages.slice(0, 5);

        // 清空现有的照片墙
        photoStackContainer.innerHTML = '';

        // 创建照片墙
        const photoWall = document.createElement('div');
        photoWall.style.position = 'relative';
        photoWall.style.width = '100%';
        photoWall.style.height = '100%';
        photoWall.style.overflow = 'hidden';

        // 添加图片到照片墙
        largeImages.forEach((item, index) => {
            const img = item.querySelector('img');
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            photoItem.style.backgroundImage = `url(${img.src})`;
            photoItem.style.opacity = index === 0 ? '1' : '0';
            
            photoWall.appendChild(photoItem);
        });

        photoStackContainer.appendChild(photoWall);

        // 创建指示器容器
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'photo-indicators';
        photoStackContainer.appendChild(indicatorsContainer);

        // 添加指示器
        largeImages.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('mouseenter', () => showPhoto(index));
            indicatorsContainer.appendChild(indicator);
        });

        let currentIndex = 0;
        let intervalId;

        function showPhoto(index) {
            const items = photoWall.querySelectorAll('.photo-item');
            const indicators = indicatorsContainer.querySelectorAll('.indicator');
            
            items[currentIndex].style.opacity = '0';
            indicators[currentIndex].classList.remove('active');
            
            currentIndex = index;
            
            items[currentIndex].style.opacity = '1';
            indicators[currentIndex].classList.add('active');
            
            // 重置定时器
            clearInterval(intervalId);
            startAutoSlide();
        }

        function startAutoSlide() {
            intervalId = setInterval(() => {
                showPhoto((currentIndex + 1) % largeImages.length);
            }, 5000); // 每5秒切换一次
        }

        startAutoSlide();

        // 当鼠标离开整个照片墙区域时，恢复自动轮播
        photoStackContainer.addEventListener('mouseleave', () => {
            clearInterval(intervalId);
            startAutoSlide();
        });
    }

    // 创建并显示自定义toast提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                <i class="fas fa-check-circle" style="margin-right: 10px; color: #4CAF50;"></i>
                <span>${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            color: #333;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-family: Arial, sans-serif;
            font-size: 16px;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(0)';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

  // 添加微信复制功能
if (wechatLink) {
    const wechatId = 'PBLEEHZ10054';

    wechatLink.addEventListener('click', function(e) {
        e.preventDefault(); // 阻止默认行为
        e.stopPropagation(); // 阻止事件冒泡
        
        // 创建一个临时的textarea元素来复制文本
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = wechatId;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        
        try {
            document.execCommand('copy');
            showToast('已复制微信号：' + wechatId + '，可直接粘贴添加！');
        } catch (err) {
            console.error('复制失败:', err);
            showToast('复制失败，请手动复制微信号：' + wechatId);
        }
        
        document.body.removeChild(tempTextArea);
    });
}

    // 初始调整
    window.addEventListener('load', () => {
        initMasonry();
        adjustAllLayouts();
        setupPhotoWall();
    });

    // 窗口大小改变时重新调整
    window.addEventListener('resize', () => {
        adjustAllLayouts();
        setupPhotoWall();
    });
});

// 添加一个用于打乱数组的辅助函数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}