const files = [
    { name: "COMPUTATION.pdf", url: "./files/COMPUTATION.pdf" },
    { name: "CE-PRESENTATION.pdf", url: "./files/CE-Presentation.pdf" },
    { name: "price2026.pdf", url: "./files/CE-Price04032026.pdf" }
];

document.addEventListener("DOMContentLoaded", () => {
    const fileContainer = document.getElementById('file-list');
    if (fileContainer) {
        files.forEach((file) => {
            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';
            fileCard.innerHTML = `
                <div class="file-icon">📄</div>
                <h3>${file.name}</h3>
                <div class="file-buttons">
                    <button class="btn btn-preview file-view-btn" data-url="${file.url}">Preview</button>
                    <a href="${file.url}" class="btn btn-download" download>Download</a>
                </div>
            `;
            fileContainer.appendChild(fileCard);
        });
    }

    const fileModal = document.getElementById('fileModal');
    const fileViewer = document.getElementById('fileViewer');

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('file-view-btn')) {
            if (fileModal && fileViewer) {
                fileViewer.src = e.target.dataset.url;
                fileModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                window.open(e.target.dataset.url, '_blank');
            }
        }
    });

    const closeFileModal = () => {
        if (fileModal) {
            fileModal.style.display = 'none';
            if (fileViewer) fileViewer.src = '';
            document.body.style.overflow = 'auto';
        }
    };
    
    document.getElementById('fileClose')?.addEventListener('click', closeFileModal);
    window.addEventListener('click', (e) => { if (e.target === fileModal) closeFileModal(); });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.getElementById('hamburger')?.classList.remove('active');
            document.querySelector('.nav-right')?.classList.remove('active');
        });
    });

    const hamburger = document.getElementById('hamburger');
    const navRight = document.querySelector('.nav-right');
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navRight.classList.toggle('active');
    });

    const modal = document.getElementById('floorplanModal');
    const modalImg = document.getElementById('modalImg');
    const modalCounter = document.getElementById('modalCounter');
    const floorplanItems = document.querySelectorAll('.floorplan-item');
    const floorplanImages = Array.from(floorplanItems).map(item => item.dataset.img || item.querySelector('img').src);
    let modalCurrent = 0;

    const updateModal = (index) => {
        modalCurrent = index;
        modalImg.src = floorplanImages[modalCurrent];
        modalCounter.textContent = `${modalCurrent + 1} / ${floorplanImages.length}`;
        modalImg.style.transform = 'scale(1)';
    };

    document.querySelectorAll('.view-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const parent = e.target.closest('.floorplan-item');
            const index = floorplanImages.indexOf(parent.dataset.img || parent.querySelector('img').src);
            updateModal(index !== -1 ? index : 0);
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; };
    document.querySelector('.close')?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.getElementById('modalPrev')?.addEventListener('click', () => updateModal((modalCurrent - 1 + floorplanImages.length) % floorplanImages.length));
    document.getElementById('modalNext')?.addEventListener('click', () => updateModal((modalCurrent + 1) % floorplanImages.length));

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') document.getElementById('modalPrev').click();
            if (e.key === 'ArrowRight') document.getElementById('modalNext').click();
            if (e.key === 'Escape') closeModal();
        }
    });

    modalImg?.addEventListener('wheel', (e) => {
        if (modal.style.display === 'block') {
            e.preventDefault();
            const scale = parseFloat(modalImg.style.transform.replace('scale(', '').replace(')', '')) || 1;
            const newScale = Math.min(Math.max(scale * (e.deltaY > 0 ? 0.9 : 1.1), 0.5), 3);
            modalImg.style.transform = `scale(${newScale})`;
        }
    }, { passive: false });
});