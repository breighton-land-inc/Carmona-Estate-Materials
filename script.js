const files = [
    { name: "COMPUTATION.pdf", url: "./files/COMPUTATION.pdf" },
    { name: "MF4 PRESENTATION.pdf", url: "./files/MF4 PRESENTATION.pdf" },
    { name: "price2026.pdf", url: "./files/price2026.pdf" }
];

document.addEventListener("DOMContentLoaded", () => {
    // Populate file list
    const fileContainer = document.getElementById('file-list');
    files.forEach(file => {
        const fileCard = document.createElement('div');
        fileCard.className = 'file-card';
        fileCard.innerHTML = `
            <div class="file-icon">📄</div>
            <h3>${file.name}</h3>
            <a href="${file.url}" class="download-btn" download>Download</a>
        `;
        fileContainer.appendChild(fileCard);
    });

    // Smooth scroll for CTA button and nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
    // Close mobile menu after navigation
            const hamburger = document.getElementById('hamburger');
            const navRight = document.querySelector('.nav-right');
            if (hamburger && navRight) {
                hamburger.classList.remove('active');
                navRight.classList.remove('active');
            }
        });
    });


    // Mobile menu toggle - now targets .nav-right
    const hamburger = document.getElementById('hamburger');
const navRight = document.querySelector('.nav-right');
    if (hamburger && navRight) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navRight.classList.toggle('active');
        };

        hamburger.addEventListener('click', toggleMenu);

        // Close menu on window resize to desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    hamburger.classList.remove('active');
                    navRight.classList.remove('active');
                }
            }, 100);
        });
    }

    // Floorplan horizontal scroll script
    const floorplanGrid = document.querySelector('.floorplan-grid');
    if (floorplanGrid) {
        let scrollLeft = 0;
        let isDown = false;

        floorplanGrid.addEventListener('mousedown', (e) => {
            isDown = true;
            floorplanGrid.style.cursor = 'grabbing';
            scrollLeft = floorplanGrid.scrollLeft;
            e.preventDefault();
        });

        floorplanGrid.addEventListener('mouseleave', () => {
            isDown = false;
            floorplanGrid.style.cursor = 'grab';
        });

        floorplanGrid.addEventListener('mouseup', () => {
            isDown = false;
            floorplanGrid.style.cursor = 'grab';
        });

        floorplanGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            floorplanGrid.style.cursor = 'grabbing';
            const x = e.pageX - floorplanGrid.offsetLeft;
            const walk = (x - scrollLeft) * 2;
            floorplanGrid.scrollLeft = scrollLeft - walk;
        });

        // Touch support for mobile
        let startX;
        floorplanGrid.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - floorplanGrid.scrollLeft;
            isDown = true;
        });

        floorplanGrid.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - startX;
            floorplanGrid.scrollLeft = -x;
        });

        floorplanGrid.addEventListener('touchend', () => {
            isDown = false;
        });

        // Hover effect
        floorplanGrid.style.cursor = 'grab';
        floorplanGrid.addEventListener('mouseenter', () => {
            floorplanGrid.style.cursor = 'grab';
        });
    }

    // Floorplan Modal
    const modal = document.getElementById('floorplanModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.querySelector('.close');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalCounter = document.getElementById('modalCounter');
    
    const floorplanItems = document.querySelectorAll('.floorplan-item');
    const floorplanImages = Array.from(floorplanItems).map(item => item.dataset.img || item.querySelector('img').src);
    let modalCurrent = 0;

    // Open modal
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgSrc = btn.dataset.img || btn.closest('.floorplan-item').querySelector('img').src;
            modalCurrent = floorplanImages.indexOf(imgSrc);
            if (modalCurrent === -1) modalCurrent = 0;
            modalImg.src = floorplanImages[modalCurrent];
            modalCounter.textContent = `${modalCurrent + 1} / ${floorplanImages.length}`;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Modal navigation
    if (modalPrev && modalNext && floorplanImages.length > 1) {
        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            modalCurrent = (modalCurrent - 1 + floorplanImages.length) % floorplanImages.length;
            modalImg.src = floorplanImages[modalCurrent];
            modalCounter.textContent = `${modalCurrent + 1} / ${floorplanImages.length}`;
        });

        modalNext.addEventListener('click', (e) => {
            e.stopPropagation();
            modalCurrent = (modalCurrent + 1) % floorplanImages.length;
            modalImg.src = floorplanImages[modalCurrent];
            modalCounter.textContent = `${modalCurrent + 1} / ${floorplanImages.length}`;
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') modalPrev.click();
            if (e.key === 'ArrowRight') modalNext.click();
            if (e.key === 'Escape') closeBtn.click();
        }
    });

    // Image zoom on wheel
    modalImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scale = modalImg.style.transform ? parseFloat(modalImg.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1) : 1;
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(scale * delta, 0.5), 3);
        modalImg.style.transform = `scale(${newScale})`;
    });
});
