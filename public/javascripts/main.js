;(function() {

  var btnSelect = document.querySelector('.btn-select');
  var fileInput = document.querySelector('.input-file');
  var form = document.querySelector('.upload-form');
  var btnSubmit = document.querySelector('.btn-submit');
  var namefield = document.querySelector('#name');
  var items = document.querySelectorAll('.js-item');
  var tips = document.querySelectorAll('.js-copy-link');
  var searchTextfield = document.querySelector('.js-search-input');
  var searchIcon = document.querySelector('.js-search-input+.input-group-btn .search-icon');
  var searchButton = document.querySelector('.js-search-input+.input-group-btn .btn');

  var originalUrl = document.location.origin;

  var shouldSubmit = false;
  var iconState = 'search';

  if (form) {
    form.addEventListener('submit', function onFormSubmit(e) {
      if (!shouldSubmit) e.preventDefault();
    });
  }

  if (btnSelect) {
    btnSelect.addEventListener('click', function onUploadButtonClick(e) {
      fileInput.click();
    });
  }

  if (btnSubmit) {
    btnSubmit.addEventListener('click', function onSubmit(e) {
      shouldSubmit = true;
    });
  }

  $(searchTextfield).on('keyup', onSearchChange);
  $(searchButton).on('click', onSearchSubmit);

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

  // Keyboard Shortcuts
  $(window).on('keyup', listenKey);

  $('.js-item').on('click', '.js-remove', onCrossClick);
  $('.js-item').on('click', '.js-edit-button', onEditClick);
  $('.js-item').on('change', '.js-edit-name', onNameChange);
  $('.js-item').on('submit', '.edit-name-form', onNameSubmit);

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

  function focusSearchBox() {
    $(searchTextfield).focus();
  }

  function showSearchIcon() {
    $(searchIcon)
      .removeClass('glyphicon-remove')
      .addClass('glyphicon-search');

    iconState = 'search';
  }

  function showCrossIcon() {
    if (iconState === 'search') {
      $(searchIcon)
      .removeClass('glyphicon-search')
      .addClass('glyphicon-remove');
      iconState = 'cross';
    }
  }

  function enableSearchButton() {
    $(searchButton).removeClass('disabled');
  }

  function disableSearchButton() {
    $(searchButton).addClass('disabled');
  }

  function onSearchChange(e) {
    var val = $(e.target).val();
    var href = originalUrl;

    // Restore to previous state
    if (!val) {
      history.replaceState(null, null, originalUrl);
      showSearchIcon();
      disableSearchButton();
    }

    // Update to current state
    if (val) {
      history.replaceState(null, null, href + '?q=' + encodeURIComponent(val));
      enableSearchButton();
    }
  }

  function onSearchSubmit(e) {
    var $icon = $(this).find('span');

    // Detect if the event is the result of
    // return key
    if (e.clientX === 0 && e.clientY === 0) {
      return;
    }

    if ($icon.hasClass('glyphicon-remove')) {
      e.preventDefault();
      document.location.href = originalUrl;
    }
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

  function listenKey(e) {
    if (e.target !== document.body) {
      return;
    }

    if (e.keyCode === 191) {
      focusSearchBox();
    }
  }

})(window);