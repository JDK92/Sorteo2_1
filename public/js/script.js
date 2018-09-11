var isValid = true;
var captchaFilled = false;


document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {
        format: 'dd/mm/yyyy',
        minDate: new Date(2018, 07, 15),
        i18n: {
            months: ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO',
                'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
            ],
            monthsFull: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
                'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ],
            monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct',
                'nov', 'dic'
            ],
            weekdaysFull: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes',
                'sábado'
            ],
            weekdaysShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            today: 'hoy',
            clear: 'borrar',
            close: 'cerrar',
            cancel: 'cancelar'
        },
        autoClose: true,
    });
});

/* LOGIN */

function validaLogin() {
    isValid = true;
    $('input').each(function () {
        if ($(this).val() === '')
            isValid = false;
    });

    habilitarLogin();
};

function validaSoporte() {
    isValid = true;
    $('#emailSoporte').each(function () {
        if ($(this).val() === '')
            isValid = false;
    });

    habilitarLogin();
};

function habilitarLogin() {
    if (!isValid) {
        $('#submit').attr('disabled', 'disabled');
    } else if (isValid) {
        $('#submit').removeAttr('disabled');
    }
}

/* REGISTRO */

function validaRegistro() {
    isValid = true;
    $('input.requiredField').each(function () {
        if ($(this).val() === '' || ($('#password').val() != $('#confirmPassword').val()))
            isValid = false;
    });
    if ($("#idEstado").val() === null)
        isValid = false;
    habilitarRegistro();
};

function habilitarRegistro() {
    if (!isValid) {
        $('#message').html('Debes de escribir la misma contraseña').removeClass('green-text').addClass('red-text');
        $('#submit').attr('disabled', 'disabled');
    } else if (isValid) {
        $('#message').html('Contraseña confirmada').removeClass('red-text').addClass('green-text');
        $('#submit').removeAttr('disabled');
    }
}

function validaDatos() {
    isValid = true;
    $('input').each(function () {
        if ($(this).val() === '')
            isValid = false;
    });
    console.log($("#idSucursal").val());
    if ($("#idSucursal").val() === null)
        isValid = false;
    habilitarSubmit();
};


function habilitarSubmit() {
    if (!isValid || !captchaFilled) {
        $('#submit').attr('disabled', 'disabled');
    } else if (isValid && captchaFilled) {
        $('#submit').removeAttr('disabled');
    }
}

function capcha_filled() {
    captchaFilled = true;
    habilitarSubmit();
};

function capcha_expired() {
    captchaFilled = false;
    habilitarSubmit();
};

$("input[type='checkbox']").change(function () {
    var a = $("input[type='checkbox']");
    if (a.length == a.filter(":checked").length) {
        // alert('all checked');
        $('#restorePass').show();
    } else {
        $('#restorePass').hide();
    }
});