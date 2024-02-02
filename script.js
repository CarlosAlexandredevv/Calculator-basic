document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector('input');
    const historicoList = document.getElementById('historico-list');
    const buttons = document.querySelectorAll('.botoes button');
    const clearHistoricoButton = document.getElementById('limpar-historico');
    let isLastButtonEqual = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            handleButtonClick(button.textContent);
        });
    });

    clearHistoricoButton.addEventListener('click', clearHistorico);

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            calculateResult();
        }
    });

    function handleButtonClick(value) {
        switch (value) {
            case '=':
                calculateResult();
                break;
            case 'C':
                clearInput();
                break;
            case '<':
                deleteLastCharacter();
                break;
            case 'x':
                appendToInput('*');
                break;
            default:
                if (isLastButtonEqual) {
                    input.value = value;
                    isLastButtonEqual = false;
                } else {
                    appendToInput(value);
                }
        }

        if (value.match(/[+\-*\/]/)) {
            input.style.letterSpacing = "1.5px";
        } else {
            input.style.letterSpacing = "normal";
        }

        checkAndRemoveOverflow();
    }

    function calculateResult() {
        try {
            const expression = input.value;
            const resultado = Function('"use strict";return (' + expression + ')')();
            if (!isNaN(resultado) && expression !== resultado.toString()) {
                addToHistorico(`${expression} = ${resultado}`);
                input.value = resultado;
            }
            isLastButtonEqual = true;
        } catch (error) {
            input.value = 'Error';
            isLastButtonEqual = true;
        }
    }

    function clearInput() {
        input.value = '';
        input.style.letterSpacing = "normal";
        isLastButtonEqual = false;
    }

    function deleteLastCharacter() {
        input.value = input.value.slice(0, -1);
        isLastButtonEqual = false;
    }

    function appendToInput(value) {
        input.value += value;
        isLastButtonEqual = false;
    }

    function addToHistorico(item) {
        const historicoItem = document.createElement('li');
        historicoItem.textContent = item;
        historicoList.insertBefore(historicoItem, historicoList.firstChild);
        checkAndRemoveOverflow();
    }

    function clearHistorico() {
        historicoList.innerHTML = '';
        checkAndRemoveOverflow();
    }

    function checkAndRemoveOverflow() {
        const maxLines = 8;
        const historicoItems = historicoList.getElementsByTagName('li');
        
        while (historicoItems.length > maxLines) {
            historicoItems[historicoItems.length - 1].remove();
        }
    }
});
