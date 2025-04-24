function validacaoFuncionario() {
    // Limpando mensagens anteriores
    limparMensagensErro();

    let formularioValido = true;

    // Pegando os elementos
    let ipt_nome = document.getElementById("ipt_nome");
    let ipt_email = document.getElementById("ipt_email");
    let ipt_senha = document.getElementById("ipt_senha");
    let ipt_confirmar_senha = document.getElementById("ipt_confirmar_senha");
    let slc_cargo = document.getElementById("slc_cargo");

    // Pegando os valores
    let nome = ipt_nome.value.trim();
    let email = ipt_email.value.trim();
    let senha = ipt_senha.value;
    let confSenha = ipt_confirmar_senha.value;
    let cargo = slc_cargo.value;

    let senhaValida = true;
    let senhaConfirmadaValida = false;
    let emailValido = false;

    // Verificações de campos obrigatórios
    if (nome === "") {
        mostrarErro(ipt_nome, "Preencha o nome.");
        formularioValido = false;
    }
    if (email === "") {
        mostrarErro(ipt_email, "Preencha o e-mail.");
        formularioValido = false;
    }
    if (senha === "") {
        mostrarErro(ipt_senha, "Preencha a senha.");
        formularioValido = false;
    }
    if (confSenha === "") {
        mostrarErro(ipt_confirmar_senha, "Confirme a senha.");
        formularioValido = false;
    }
    if (cargo === "" || cargo === "0") {
        mostrarErro(slc_cargo, "Selecione um cargo.");
        formularioValido = false;
    }

    if (!formularioValido) return false;

    // Validação de e-mail
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    if (regexEmail.test(email)) {
        emailValido = true;
    } else {
        mostrarErro(ipt_email, "E-mail inválido.");
        formularioValido = false;
    }

    // Validação da senha
    if (senha.length < 8) {
        mostrarErro(ipt_senha, "Senha deve ter pelo menos 8 caracteres.");
        senhaValida = false;
    }
    if (senha === senha.toUpperCase()) {
        mostrarErro(ipt_senha, "Senha deve conter letras minúsculas.");
        senhaValida = false;
    }
    if (senha === senha.toLowerCase()) {
        mostrarErro(ipt_senha, "Senha deve conter letras maiúsculas.");
        senhaValida = false;
    }
    if (!/\d/.test(senha)) {
        mostrarErro(ipt_senha, "Senha deve conter pelo menos um número.");
        senhaValida = false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
        mostrarErro(ipt_senha, "Senha deve conter um caractere especial.");
        senhaValida = false;
    }

    // Confirmação da senha
    if (senha !== confSenha) {
        mostrarErro(ipt_confirmar_senha, "As senhas não coincidem.");
        formularioValido = false;
    } else {
        senhaConfirmadaValida = true;
    }

    // Verificação final
    if (formularioValido && emailValido && senhaValida && senhaConfirmadaValida) {
        setTimeout(function () {
            Swal.fire({
                title: "Cadastro realizado com sucesso!",
                text: "Clique em OK para sair!",
                icon: "success"
            });
        }, 500);
        setTimeout(function (){
            limparFormulario();
        }, 1500);
        return true;
    }

    return false;
}

// Validação em tempo real (sem apagar erros dos outros campos)
document.addEventListener("DOMContentLoaded", () => {
    const campos = [
        { id: "ipt_nome", msg: "Preencha o nome." },
        { id: "ipt_email", msg: "Preencha o e-mail.", extra: validarEmail },
        { id: "ipt_senha", msg: "Preencha a senha." },
        { id: "ipt_confirmar_senha", msg: "Confirme a senha." },
        { id: "slc_cargo", msg: "Selecione um cargo." }
    ];

    campos.forEach(({ id, msg, extra }) => {
        const input = document.getElementById(id);
        input.addEventListener("blur", () => {
            if (input.value.trim() === "") {
                mostrarErro(input, msg);
            } else if (extra) {
                extra(input);
            } else {
                limparErroIndividual(input);
            }
        });
    });
});

function limparFormulario(){
    document.getElementById("ipt_nome").value = "";
    document.getElementById("ipt_email").value = "";
    document.getElementById("ipt_senha").value = "";
    document.getElementById("ipt_confirmar_senha").value = "";
    document.getElementById("slc_cargo").value = "0";
}