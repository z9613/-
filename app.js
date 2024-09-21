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

// 页面加载完成后初始化 Masonry
window.addEventListener('load', initMasonry);