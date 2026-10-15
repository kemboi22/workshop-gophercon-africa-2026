// Collecting stickers: the ♥ on a card saves it in this browser, the header
// counts them, and its button shows only the collected ones.

(function () {
	const list = document.getElementById('sightings');
	const button = document.querySelector('[data-stickers]');
	if (!list || !button) return;

	const KEY = 'kawaii-critters:stickers';
	const count = button.querySelector('[data-sticker-count]');
	let saved;
	try {
		saved = new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
	} catch (_) {
		saved = new Set();
	}

	function save() {
		try {
			localStorage.setItem(KEY, JSON.stringify(Array.from(saved)));
		} catch (_) {}
	}

	function mark(card, on) {
		card.closest('li').classList.toggle('is-collected', on);
		const heart = card.querySelector('.card__heart');
		if (heart) heart.setAttribute('aria-pressed', String(on));
	}

	function update() {
		count.textContent = String(saved.size);
		button.classList.toggle('has-stickers', saved.size > 0);
	}

	list.querySelectorAll('.card[data-key]').forEach(function (card) {
		if (saved.has(card.dataset.key)) mark(card, true);
	});
	update();
	button.hidden = false;

	list.addEventListener('click', function (e) {
		const heart = e.target.closest('.card__heart');
		if (!heart) return;
		const card = heart.closest('.card');
		const key = card.dataset.key;
		const on = !saved.has(key);
		if (on) saved.add(key);
		else saved.delete(key);
		save();
		mark(card, on);
		update();
		if (on) {
			const r = heart.getBoundingClientRect();
			if (window.burst) window.burst(document.body, r.left + r.width / 2, r.top + r.height / 2, 10);
			button.classList.remove('is-bumped');
			void button.offsetWidth;
			button.classList.add('is-bumped');
		}
	});

	button.addEventListener('click', function () {
		const on = !document.documentElement.classList.contains('only-stickers');
		document.documentElement.classList.toggle('only-stickers', on);
		button.setAttribute('aria-pressed', String(on));
		if (on) list.scrollIntoView({ block: 'start' });
	});
})();
