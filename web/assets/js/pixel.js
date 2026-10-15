// Draws each card photo as chunky pixel art on a canvas over it. Pointing at
// the card fades the canvas away to show the real photo. Without this script
// the photos simply show as they are.

(function () {
	const BLOCKS = 40; // Pixels across a card photo.

	// Draws img into canvas at `across` blocks wide, cropped to the canvas's shape like object-fit: cover.
	function pixelate(img, canvas, across) {
		const rect = canvas.getBoundingClientRect();
		const ratio = rect.height / rect.width || 1;
		const w = Math.max(1, Math.round(across));
		const h = Math.max(1, Math.round(across * ratio));
		const iw = img.naturalWidth, ih = img.naturalHeight;
		const scale = Math.max(w / iw, h / ih);
		const sw = w / scale, sh = h / scale;
		canvas.width = w;
		canvas.height = h;
		canvas.getContext('2d').drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, w, h);
	}
	window.pixelate = pixelate;

	function paint(img) {
		if (!img.naturalWidth) return;
		const canvas = document.createElement('canvas');
		canvas.className = 'pixels';
		canvas.setAttribute('aria-hidden', 'true');
		img.after(canvas);
		pixelate(img, canvas, BLOCKS);
	}

	// Only cards scrolled near get painted: there are thousands.
	const seen = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) return;
			seen.unobserve(entry.target);
			const img = entry.target;
			if (img.complete) paint(img);
			else img.addEventListener('load', function () { paint(img); }, { once: true });
		});
	}, { rootMargin: '400px' });

	document.querySelectorAll('img[data-pixel]').forEach(function (img) {
		seen.observe(img);
	});
})();
