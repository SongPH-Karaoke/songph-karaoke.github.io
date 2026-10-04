(function () {
  'use strict';
  var download = document.getElementById('download-apk');
  if (!download) return;
  document.addEventListener('keydown', function (event) {
    if (/^Arrow(Up|Down|Left|Right)$/.test(event.key) &&
        (document.activeElement === document.body || document.activeElement === download)) {
      event.preventDefault();
      download.focus();
    }
    if (document.activeElement === download &&
        (event.key === ' ' || event.key === 'Select' || event.key === 'Accept')) {
      event.preventDefault();
      download.click();
    }
  });
}());
