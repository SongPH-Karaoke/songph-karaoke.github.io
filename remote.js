(function () {
  'use strict';
  var origin = 'https://songph-vouchers.songph-vouchers.workers.dev';
  var latestRequest = 0;
  var buttons = [document.getElementById('download-apk'), document.getElementById('download-remote')].filter(Boolean);
  document.addEventListener('keydown', function (event) {
    var selected = buttons.indexOf(document.activeElement);
    if (/^Arrow(Up|Down|Left|Right)$/.test(event.key) && (selected >= 0 || document.activeElement === document.body)) {
      event.preventDefault();
      var direction = event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1;
      var next = selected < 0 ? 0 : Math.max(0, Math.min(buttons.length - 1, selected + direction));
      if (buttons[next]) buttons[next].focus();
    }
    if (selected >= 0 && (event.key === ' ' || event.key === 'Select' || event.key === 'Accept')) {
      event.preventDefault();
      buttons[selected].click();
    }
  });
  function release(item, kind) {
    if (!item || !/^\d+\.\d+\.\d+$/.test(item.version) || !Number.isSafeInteger(item.bytes) || item.bytes <= 0) return;
    var remote = kind === 'remote';
    var id = remote ? 'download-remote' : 'download-apk';
    var path = remote ? '/app/remote/latest.apk' : '/app/latest.apk';
    var expectedUrl = origin + path + '?v=' + item.version;
    if (item.url !== expectedUrl) return;
    document.getElementById(kind + '-version').textContent = 'Version ' + item.version;
    document.getElementById(kind + '-size').textContent = Math.ceil(item.bytes / 1000000) + ' MB APK';
    var button = document.getElementById(id);
    button.href = expectedUrl;
    button.download = (remote ? 'SongPH-Remote-' : 'SongPH-') + item.version + '.apk';
  }
  function refresh() {
    if (!window.fetch) return;
    var request = ++latestRequest;
    fetch(origin + '/app/releases.json', {cache: 'no-store', credentials: 'omit'})
      .then(function (response) { if (!response.ok) throw new Error('Release lookup unavailable'); return response.json(); })
      .then(function (data) {
        if (request !== latestRequest || !data || typeof data !== 'object') return;
        release(data.app, 'app'); release(data.remote, 'remote');
      })
      .catch(function () {});
  }
  refresh();
  document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });
}());
