;(function() {

  var btnSelect = document.querySelector('.btn-select');
  var fileInput = document.querySelector('.input-file');
  var form = document.querySelector('.upload-form');
  var btnSubmit = document.querySelector('.btn-submit');
  var namefield = document.querySelector('#name');
  var items = document.querySelectorAll('.item');
  var tips = document.querySelectorAll('.js-copy-link');
  // var move = require('move');


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

  $('.item').on('click', '.js-remove', onCrossClick);

  function onCrossClick(e) {
    var item = e.delegateTarget;
    var id = item.getAttribute('data-id');

    if (item) {
      deleteItem(id, function() {
        item.parentNode.remove();
      });
    }
  }

  function deleteItem(id, done) {
    $.ajax({
      url: '/v1/delete',
      type: 'delete',
      data: { id: id }
    }).done(function() {
      done();
    }).fail(function(jqXhr, statusText, msg) {
      notify('Failed to delete', jqXhr.responseText);
    }).always(function() {

    });
  }

  function notify(msgHuman, msgMachine) {
    console.log(msgHuman, ' - ', msgMachine);
  }

  // Show remove
  bind(items, function(e) {
    var remove = this.querySelector('.js-remove');
    remove.classList.remove('hide');
  }, 'mouseenter');

  // Hide remove
  bind(items, function(e) {
    var remove = this.querySelector('.js-remove');
    remove.classList.add('hide');
  }, 'mouseleave');

  function bind(els, listener, eventName, capture) {
    eventName = eventName || 'click';
    capture = capture || false;
    for (var i = 0, len = els.length; i < len; ++i) {
      els[i].addEventListener(eventName, listener, capture);
    }
  }

  function delegate(e) {
    var el = e.target;

    // toggleClass(overlay, 'hide');

    if (el.classList.contains('js-cog')) {
      oncogclick(el, this);
    } else if (e.target === '') {

    }
  }

  function oncogclick(el, parent) {
    console.log(parent);
    var overlay = parent.querySelector('.item-overlay');
    overlay.classList.remove('hide');

    setTimeout(function() {
      overlay.style.opacity = '1.0';
    }, 1)

    // move(parent)
    //   .scale(0)
    //   .duration(400)
    //   .end(function() {
    //     parent.parentNode.remove();
    //   });
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