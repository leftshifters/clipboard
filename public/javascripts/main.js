;(function() {

  var btnSelect = document.querySelector('.btn-select');
  var fileInput = document.querySelector('.input-file');
  var form = document.querySelector('.upload-form');
  var btnSubmit = document.querySelector('.btn-submit');

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
    console.log(e);
    btnSubmit.removeAttribute('disabled');
  });

})(window);