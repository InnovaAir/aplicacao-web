Usuario = sessionStorage.User

Mensagem_Usuario.innerHTML = `Olá, ${Usuario}`

function addDispositivo() {
    document.getElementById("div_colab").style.display = "none"
    document.getElementById("div_disp").style.display = "block"
    document.getElementById("aD").style.display = "none"
    document.getElementById("cD").style.display = "flex"
    document.getElementById("aC").style.display = "flex"
    document.getElementById("cC").style.display = "none"
}

function cadastrarDispositivo() {}

function addColaborador() {
    document.getElementById("div_disp").style.display = "none"
    document.getElementById("div_colab").style.display = "block"
    document.getElementById("aD").style.display = "flex"
    document.getElementById("cD").style.display = "none"
    document.getElementById("aC").style.display = "none"
    document.getElementById("cC").style.display = "flex"
    }

function cadastrarColaborador() {}