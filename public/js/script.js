document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
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

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);
});

var confettiSettings = {
    target: 'confetti-holder'
};

var confetti = new ConfettiGenerator(confettiSettings);
confetti.render();

(function () {
    $('input').keyup(function () {

        var empty = false;
        $('input').each(function () {
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if (empty) {
            $('#submit').attr('disabled', 'disabled');
        } else {
            $('#submit').removeAttr('disabled');
        }
    });
})()