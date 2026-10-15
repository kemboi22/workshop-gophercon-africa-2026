// Lifts the loading screen once the page is in, and marks each card photo
// as loaded so its shimmer stops and the photo fades in.

(function () {
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
})();
