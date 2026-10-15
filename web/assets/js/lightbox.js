// Click any card to open it big in the layout's #lightbox dialog: it pops in,
// the photo sharpens from big pixels to the full picture, and the arrows (or
// arrow keys) step through the cards still showing. Without this script a
// photo's link still opens the photo on its own.

(function () {
	const dialog = document.getElementById('lightbox');
	const list = document.getElementById('sightings');
	if (!dialog || !list || typeof dialog.showModal !== 'function') return;

	const $ = function (sel) { return dialog.querySelector(sel); };
	const img = $('.lightbox__image');
	const canvas = $('.lightbox__pixels');
	const stage = $('.lightbox__stage');
	const nophoto = $('.lightbox__nophoto');
	const credit = $('.lightbox__credit');
	const ref = $('.lightbox__ref');
	const still = matchMedia('(prefers-reduced-motion: reduce)');
	const STEPS = [6, 12, 24, 48, 96];
	let run = 0;
	let current = null;

	// Only web links: every URL here is GBIF's.
	function safe(url) {
		try {
			return /^https?:$/.test(new URL(url, location.href).protocol) ? url : '';
		} catch (_) {
			return '';
		}
	}

	function visible() {
		return Array.from(list.querySelectorAll(':scope > li:not([hidden]) .card'));
	}

	function text(card, sel) {
		const el = card.querySelector(sel);
		return el ? el.textContent : '';
	}

	// Shows the card's small photo as big pixels, then sharpens in steps once the large one arrives.
	function reveal(thumb, href) {
		const id = ++run;
		img.removeAttribute('src');
		dialog.classList.add('is-loading');
		canvas.hidden = false;
		canvas.width = canvas.width; // Clears the last photo.

		if (thumb && thumb.naturalWidth) {
			stage.style.setProperty('--ratio', String(thumb.naturalWidth / thumb.naturalHeight));
			requestAnimationFrame(function () {
				if (id === run && window.pixelate) window.pixelate(thumb, canvas, STEPS[0]);
			});
		}

		const big = new Image();
		big.onload = function () {
			if (id !== run) return;
			stage.style.setProperty('--ratio', String(big.naturalWidth / big.naturalHeight));
			img.src = big.src;
			dialog.classList.remove('is-loading');
			if (still.matches || !window.pixelate) {
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
			if (id !== run) return;
			dialog.classList.remove('is-loading');
			if (thumb && thumb.naturalWidth) img.src = thumb.src;
		};
		big.src = href;
	}

	function open(card) {
		current = card;
		const cards = visible();
		const link = card.querySelector('[data-lightbox]');
		const href = link && link.href ? safe(link.href) : '';
		const thumb = card.querySelector('.card__zoom img[data-pixel]');

		// textContent and cloned nodes only, never innerHTML: the text is GBIF's.
		$('.lightbox__number').textContent = 'Critter ' + (cards.indexOf(card) + 1) + ' of ' + cards.length;
		$('.lightbox__name').textContent = text(card, '.card__name');
		$('.lightbox__latin').textContent = text(card, '.card__scientific');
		const facts = $('.lightbox__facts');
		facts.replaceChildren(card.querySelector('.card__meta').cloneNode(true));
		const badge = card.querySelector('.card__badge');
		if (badge) {
			const count = document.createElement('p');
			count.className = 'lightbox__count';
			count.textContent = badge.textContent.replace('×', '') + ' seen together';
			facts.append(count);
		}

		const by = link ? link.dataset.credit || '' : '';
		credit.textContent = by ? 'Photo © ' + by : '';
		credit.hidden = !by;

		const record = safe(card.dataset.ref || '');
		ref.hidden = !record;
		if (record) ref.href = record;
		else ref.removeAttribute('href');

		img.alt = thumb ? thumb.alt : '';
		nophoto.hidden = !!href;
		stage.classList.toggle('is-empty', !href);
		if (href) reveal(thumb, href);
		else {
			run++;
			img.removeAttribute('src');
			canvas.hidden = true;
			dialog.classList.remove('is-loading');
			stage.style.setProperty('--ratio', '1');
		}

		if (!dialog.open) dialog.showModal();
		dialog.classList.remove('is-switching');
		void dialog.offsetWidth;
		dialog.classList.add('is-switching');
	}

	function step(by) {
		const cards = visible();
		if (!cards.length) return;
		const i = cards.indexOf(current);
		open(cards[(i + by + cards.length) % cards.length]);
	}

	list.addEventListener('click', function (e) {
		const card = e.target.closest('.card');
		if (!card) return;
		// Let new-tab clicks through to the photo.
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		open(card);
	});

	dialog.querySelectorAll('[data-step]').forEach(function (button) {
		button.addEventListener('click', function () {
			step(Number(button.dataset.step));
		});
	});

	dialog.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowRight') step(1);
		if (e.key === 'ArrowLeft') step(-1);
	});

	// A click on the backdrop lands on the dialog itself; one inside the panel doesn't.
	dialog.addEventListener('click', function (e) {
		if (e.target === dialog) dialog.close();
	});

	dialog.addEventListener('close', function () {
		run++;
		img.removeAttribute('src');
		const link = current && current.querySelector('[data-lightbox]');
		if (link) link.focus({ preventScroll: true });
	});
})();
