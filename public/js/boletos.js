'use strict'

var apifunction = {
    sumarBoletos: function (totalBoletos) {
        var total = 0;
        for (let i = 0; i < totalBoletos.length; i++) {
            total = total + totalBoletos[i].boletos;
        }

        return total;
    },
};

module.exports = apifunction;