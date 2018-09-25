'use strict'

var isValid = true;

$("select").on("change", function () {
    isValid = true;
    var id = $(this).attr("id");
    var key = id.split("select")[1];
    var submitButton = `button#btn${key}`;
    var theComments = `textarea#observaciones${key}`

    if ($(this).val() === null) {
        isValid = false;
    }

    if (isValid) {
        $(submitButton).removeAttr('disabled');
        if ($(this).val() == 2) {
            $(submitButton).html('Aceptar factura').removeClass('red').addClass('green');
            $(theComments).removeAttr('required').attr('disabled', 'true');
        } else if ($(this).val() == 0) {
            $(submitButton).html('Rechazar factura').removeClass('green').addClass('red');
            $(theComments).removeAttr('disabled').attr('required', 'true').focus();
        }
    }
});

