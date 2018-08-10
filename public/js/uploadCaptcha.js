var isValid = true;
var captchaFilled = false;

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {
        format: 'dd/mm/yyyy',
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
        autoClose: true
    });
});


function validaDatos() {
    isValid = true;
    $('input').each(function() {
        if ($(this).val() === '')
            isValid = false;
    });
    console.log($("#idSucursal").val());
    if ($("#idSucursal").val() === null)
        isValid = false;
    habilitarSubmit();
};

function validaRegistro() {
    isValid = true;
    $('input').each(function() {
        if ($(this).val() === '')
            isValid = false;
    });

    habilitarRegistro();
};

function habilitarRegistro() {
    if (!isValid || $('#password') != $('#confirmPassword')) {
        $('#submit').attr('disabled', 'disabled');
    } else if (isValid && $('#password') == $('#confirmPassword')) {
        $('#submit').removeAttr('disabled');
    }
}


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