// Opens any a[data-lightbox] in the layout's #lightbox dialog: it pops in,
// then the photo sharpens from big pixels to the full picture. Without this
// script the links still open the photo on its own.

(function () {
	const dialog = document.getElementById('lightbox');
	if (!dialog || typeof dialog.showModal !== 'function') return;

	const img = dialog.querySelector('.lightbox__image');
	const canvas = dialog.querySelector('.lightbox__pixels');
	const stage = dialog.querySelector('.lightbox__stage');
	const caption = dialog.querySelector('.lightbox__caption');
	const STEPS = [6, 12, 24, 48, 96];
	let run = 0;

	// Shows the card's own small photo, pixelated, then sharpens in steps once the big one arrives.
	function reveal(thumb, href) {
		const id = ++run;
		dialog.classList.add('is-loading');
		canvas.hidden = false;
		img.removeAttribute('src');

		const still = window.pixelStill && window.pixelStill.matches;
		const big = new Image();
		big.onload = function () {
			if (id !== run) return;
			img.src = big.src;
			stage.style.setProperty('--ratio', String(big.naturalWidth / big.naturalHeight));
			dialog.classList.remove('is-loading');
			if (still || !window.pixelate) {
				canvas.hidden = true;
				return;
			}
			let i = 0;
			(function step() {
				if (id !== run) return;
				if (i === STEPS.length) {
					canvas.hidden = true;
					return;
				}
				window.pixelate(big, canvas, STEPS[i++]);
				setTimeout(step, 90);
			})();
		};
		big.onerror = function () {
			if (id === run) dialog.classList.remove('is-loading');
		};
		big.src = href;

		if (thumb && thumb.naturalWidth) {
			stage.style.setProperty('--ratio', String(thumb.naturalWidth / thumb.naturalHeight));
		}
		dialog.showModal();
		// The stage only has a size once the dialog is open.
		if (thumb && thumb.naturalWidth && window.pixelate) window.pixelate(thumb, canvas, STEPS[0]);
	}

	document.addEventListener('click', function (e) {
		const link = e.target.closest('a[data-lightbox]');
		// Let new-tab clicks through, and only show web images: the URL is GBIF's.
		if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		if (!/^https?:$/.test(new URL(link.href, location.href).protocol)) return;
		e.preventDefault();

		const thumb = link.querySelector('img');
		img.alt = thumb ? thumb.alt : '';
		// textContent, never innerHTML: captions are untrusted GBIF text.
		caption.textContent = link.dataset.caption || '';
		caption.hidden = caption.textContent === '';
		reveal(thumb, link.href);
	});

	// A click on the backdrop lands on the dialog itself; one on the photo doesn't.
	dialog.addEventListener('click', function (e) {
		if (e.target === dialog) dialog.close();
	});

	dialog.addEventListener('close', function () {
		run++;
		img.removeAttribute('src');
	});
})();
