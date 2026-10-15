// Lifts the loading screen once the page is in, marks each card photo as
// loaded so its shimmer stops, rotates the fox's tips, and offers burst(),
// a little explosion of stars and hearts the other scripts use.

(function () {
	const still = matchMedia('(prefers-reduced-motion: reduce)');

	function done() {
		document.documentElement.classList.add('is-ready');
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', done);
	else done();

	function loaded(img) {
		img.closest('.card__photo').classList.add(img.naturalWidth ? 'is-loaded' : 'is-broken');
	}

	document.querySelectorAll('.card__zoom img[data-pixel]').forEach(function (img) {
		if (img.complete) loaded(img);
		else {
			img.addEventListener('load', function () { loaded(img); }, { once: true });
			img.addEventListener('error', function () { loaded(img); }, { once: true });
		}
	});

	// Sprinkles stars and hearts out from (x, y) inside parent, then tidies them away.
	window.burst = function (parent, x, y, count) {
		if (still.matches) return;
		const box = document.createElement('div');
		box.className = 'burst';
		box.setAttribute('aria-hidden', 'true');
		box.style.left = x + 'px';
		box.style.top = y + 'px';
		const n = count || 12;
		for (let i = 0; i < n; i++) {
			const bit = document.createElement('span');
			const angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
			const reach = 50 + Math.random() * 60;
			bit.textContent = i % 3 === 0 ? '♥' : '★';
			bit.className = 'burst__bit burst__bit--' + (i % 3);
			bit.style.setProperty('--dx', Math.cos(angle) * reach + 'px');
			bit.style.setProperty('--dy', Math.sin(angle) * reach + 'px');
			bit.style.setProperty('--spin', (Math.random() * 360 - 180) + 'deg');
			box.append(bit);
		}
		parent.append(box);
		setTimeout(function () { box.remove(); }, 900);
	};

	const tips = [
		'Psst! Tap any card to meet the critter up close.',
		'Tap the ♥ on a card to collect it as a sticker!',
		'Point at a photo to see it without the pixels.',
		'Try searching for a country, like Kenya or Brazil.',
		'Inside a card, use ← and → to hop to the next critter.',
		'Tap “Bird” or “Reptile” to see just those.',
	];
	const bubble = document.querySelector('[data-tips]');
	if (bubble && !still.matches) {
		let i = 0;
		setInterval(function () {
			i = (i + 1) % tips.length;
			bubble.classList.remove('is-new');
			void bubble.offsetWidth;
			bubble.textContent = tips[i];
			bubble.classList.add('is-new');
		}, 6000);
	}
})();
