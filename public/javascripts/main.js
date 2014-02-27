;(function() {

  var btnSelect = document.querySelector('.btn-select');
  var fileInput = document.querySelector('.input-file');
  var form = document.querySelector('.upload-form');
  var btnSubmit = document.querySelector('.btn-submit');
  var namefield = document.querySelector('#name');
  var items = document.querySelectorAll('.item');

  var shouldSubmit = false;

  form.addEventListener('submit', function onFormSubmit(e) {
    if (!shouldSubmit) e.preventDefault();
  });

  btnSelect.addEventListener('click', function onUploadButtonClick(e) {
    fileInput.click();
  });

  btnSubmit.addEventListener('click', function onSubmit(e) {
    shouldSubmit = true;
  });

  fileInput.addEventListener('change', function onChange(e) {
    btnSubmit.removeAttribute('disabled');
    namefield.focus();
  });


  bind(items, delegate);

  function bind(els, listener, eventName, capture) {
    eventName = eventName || 'click';
    capture = capture || false;
    for (var i = 0, len = els.length; i < len; ++i) {
      els[i].addEventListener(eventName, listener, capture);
    }
  }

  function delegate(e) {
    var overlay = this.querySelector('.item-overlay');
    var el = e.target;
    console.log(overlay);
    toggleClass(overlay, 'hide');
    // if (el.classList.contains('js-cog')) {
    //   oncogclick(el);
    // } else if (e.target === '') {

    // }
  }

  function oncogclick(el) {
    console.log(el.parentNode);
    document.querySelector()
  }

  function toggleClass(el, className) {
    className = className || '';
    if (el.classList) {
      el.classList.toggle(className);
    } else {
      var classes = el.className.split(' ');
      var existingIndex = classes.indexOf(className);

      if (existingIndex >= 0)
        classes.splice(existingIndex, 1);
      else
        classes.push(className);

      el.className = classes.join(' ');
    }
  }

})(window);