;(function() {

  var btnSelect = document.querySelector('.btn-select');
  var fileInput = document.querySelector('.input-file');
  var form = document.querySelector('.upload-form');
  var btnSubmit = document.querySelector('.btn-submit');
  var namefield = document.querySelector('#name');
  var items = document.querySelectorAll('.js-item');
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

  $(fileInput).on('change', function onChange(e) {
    var filename = $(this).val().split('/').pop().split('\\').pop();
    if (filename) {
      $(btnSelect).text('Change file');
      $(namefield).val(filename).select();
    }
    btnSubmit.removeAttribute('disabled');
    namefield.focus();
  });

  bind(items, delegate);

  $('.js-item').on('click', '.js-remove', onCrossClick);
  $('.js-item').on('click', '.js-edit-button', onEditClick);
  $('.js-item').on('change', '.js-edit-name', onNameChange);
  $('.js-item').on('submit', '.edit-name-form', onNameSubmit);

  // $(document).on('keyup', onKeytype);
  // var searchform = document.querySelector('.search-form');

  // function onKeytype(e) {
  //   console.log('typed');
  //   showNode(searchform);
  //   var input = this.querySelector('.search-form input');
  //   input.focus();
  // }

  function onCrossClick(e) {
    var item = e.delegateTarget;
    var id = item.getAttribute('data-id');

    if (item) {
      deleteItem(id, function() {
        item.parentNode.remove();
      });
    }
  }

  function onEditClick(e) {
    var item = e.delegateTarget;
    var anchor = item.querySelector('.js-item-link');
    var form = item.querySelector('.edit-name-form');
    var button = item.querySelector('.js-edit-button');
    var input = form.querySelector('.js-edit-name');
    var editon = button.classList.contains('active');

    if (editon) {
      showNode(anchor);
      hideNode(form);
      deactivateNode(button);
    } else {
      hideNode(anchor);
      showNode(form);
      activateNode(button);
      input.focus();
    }
  }

  function onNameChange(e) {
    var item = e.delegateTarget;
    var id = item.getAttribute('data-id');
    var button = item.querySelector('.js-edit-button');
    var form = item.querySelector('.edit-name-form');
    var anchor = item.querySelector('.js-item-link');
    var input = item.querySelector('.js-edit-name');
    anchor.innerHTML = input.value;
    deactivateNode(button);
    hideNode(button);
    hideNode(form);
    showNode(anchor);
    saveName(id, input.value, function() { });
  }

  function onNameSubmit(e) {
    e.preventDefault();
  }

  function activateNode(node) {
    node.classList.add('active');
  }

  function deactivateNode(node) {
    node.classList.remove('active');
  }

  function showNode(node) {
    node.classList.remove('hide');
  }

  function hideNode(node) {
    node.classList.add('hide');
  }

  function deleteItem(id, done) {
    $.ajax({
      url: '/v1/items/' + id,
      type: 'delete'
    }).done(function() {
      done();
    }).fail(function(jqXhr, statusText, msg) {
      notify('Failed to delete', jqXhr.responseText);
    }).always(function() {

    });
  }

  function saveName(id, name, done) {
    $.ajax({
      url: '/v1/items/' + id,
      type: 'put',
      data: { name: name }
    }).done(function() {
      // done();
    }).fail(function() {
      notify('Failed to change name', jqXhr.responseText);
    }).always(function() {

    });
  }

  function notify(msgHuman, msgMachine) {
    console.log(msgHuman, ' - ', msgMachine);
  }

  // Show remove
  bind(items, function(e) {
    var remove = this.querySelector('.js-remove');
    var edit = this.querySelector('.js-edit-button');
    showNode(remove);
    showNode(edit);
  }, 'mouseenter');

  // Hide remove
  bind(items, function(e) {
    var remove = this.querySelector('.js-remove');
    var edit = this.querySelector('.js-edit-button');
    hideNode(remove);
    if (!edit.classList.contains('active')) hideNode(edit);
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