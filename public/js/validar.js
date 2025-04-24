function validarFormulario() {
    // Limpando mensagens anteriores
    limparMensagensErro();

    let formularioValido = true;

    // Pegando os elementos
    let ipt_razao_social = document.getElementById("ipt_razao_social");
    let ipt_email = document.getElementById("ipt_email");
    let ipt_telefone = document.getElementById("ipt_telefone");
    let ipt_responsavel = document.getElementById("ipt_responsavel");
    let ipt_cnpj = document.getElementById("ipt_cnpj");
    let ipt_senha = document.getElementById("ipt_senha");
    let ipt_confirmar_senha = document.getElementById("ipt_confirmar_senha");

    // Pegando os valores
    let razao = ipt_razao_social.value.trim();
    let email = ipt_email.value.trim();
    let telefone = ipt_telefone.value.replace(/\D/g, ""); // remove tudo que não é número
    let responsavel = ipt_responsavel.value.trim();
    let cnpj = ipt_cnpj.value.replace(/\D/g, ""); // remove tudo que não é número
    let senha = ipt_senha.value;
    let confSenha = ipt_confirmar_senha.value;

    let senhaValida = true;
    let senhaConfirmadaValida = false;
    let emailValido = false;

    // Verificações de campos obrigatórios
    if (razao === "") {
        mostrarErro(ipt_razao_social, "Preencha a razão social.");
        formularioValido = false;
    }
    if (email === "") {
        mostrarErro(ipt_email, "Preencha o e-mail.");
        formularioValido = false;
    }
    if (telefone === "") {
        mostrarErro(ipt_telefone, "Preencha o telefone.");
        formularioValido = false;
    }
    if (responsavel === "") {
        mostrarErro(ipt_responsavel, "Preencha o responsável.");
        formularioValido = false;
    }
    if (cnpj === "") {
        mostrarErro(ipt_cnpj, "Preencha o CNPJ.");
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

    if (!formularioValido) return false;

    // Validação de e-mail
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    if (regexEmail.test(email)) {
        emailValido = true;
    } else {
        mostrarErro(ipt_email, "E-mail inválido.");
        formularioValido = false;
    }

    // Validação de telefone (mínimo 10 dígitos para BR - ex: 11912345678)
    if (telefone.length < 10 || telefone.length > 11) {
        mostrarErro(ipt_telefone, "Telefone inválido. Insira DDD + número.");
        formularioValido = false;
    }

    // Validação de CNPJ (14 dígitos)
    if (cnpj.length !== 14) {
        mostrarErro(ipt_cnpj, "CNPJ inválido. Deve conter 14 dígitos.");
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
        alert("Cadastro realizado com sucesso!");
        cadastrar(razao, email, telefone, responsavel, cnpj, senha);
        return true;
    }

    return false;
}

function mostrarErro(inputElement, mensagem) {
    inputElement.classList.add("input-erro");

    let proximoElemento = inputElement.nextElementSibling;
    if (proximoElemento && proximoElemento.classList.contains("mensagem-erro")) {
        proximoElemento.innerText = mensagem;
    } else {
        let mensagemErro = document.createElement("span");
        mensagemErro.classList.add("mensagem-erro");
        mensagemErro.innerText = mensagem;
        inputElement.insertAdjacentElement("afterend", mensagemErro);
    }
}

function limparMensagensErro() {
    document.querySelectorAll(".mensagem-erro").forEach(el => el.remove());
    document.querySelectorAll(".input-erro").forEach(el => el.classList.remove("input-erro"));
}

// Validação em tempo real (sem apagar erros dos outros campos)
document.addEventListener("DOMContentLoaded", () => {
    const campos = [
        { id: "ipt_razao_social", msg: "Preencha a razão social." },
        { id: "ipt_email", msg: "Preencha o e-mail.", extra: validarEmail },
        { id: "ipt_telefone", msg: "Preencha o telefone." },
        { id: "ipt_responsavel", msg: "Preencha o responsável." },
        { id: "ipt_cnpj", msg: "Preencha o CNPJ." },
        { id: "ipt_senha", msg: "Preencha a senha." },
        { id: "ipt_confirmar_senha", msg: "Confirme a senha." }
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

// Validação individual de e-mail (extra)
function validarEmail(input) {
    const email = input.value.trim();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    if (!regex.test(email)) {
        mostrarErro(input, "E-mail inválido.");
    } else {
        limparErroIndividual(input);
    }
}

function limparErroIndividual(input) {
    input.classList.remove("input-erro");
    const proximo = input.nextElementSibling;
    if (proximo && proximo.classList.contains("mensagem-erro")) {
        proximo.remove();
    }
}

function validarLogin() {
    // Limpando mensagens de erro anteriores
    limparMensagensErro();

    let formularioValido = true;

    // Pegando os elementos do formulário
    let ipt_email = document.getElementById("ipt_email");
    let ipt_senha = document.getElementById("ipt_senha");

    // Pegando os valores dos campos
    let email = ipt_email.value.trim();
    let senha = ipt_senha.value.trim();

    // Validação do e-mail
    let emailValido = false;
    if (email === "") {
        mostrarErro(ipt_email, "Preencha o e-mail.");
        formularioValido = false;
    } else {
        let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
        if (regexEmail.test(email)) {
            emailValido = true;
        } else {
            mostrarErro(ipt_email, "E-mail inválido.");
            formularioValido = false;
        }
    }
    // Validação da senha
    if (senha === "") {
        mostrarErro(ipt_senha, "Preencha a senha.");
        formularioValido = false;
    } else if (senha.length < 8) {
        mostrarErro(ipt_senha, "Senha deve ter pelo menos 8 caracteres.");
        formularioValido = false;
    }

    // Verificação final
    if (formularioValido && emailValido) {
        alert("Login realizado com sucesso!");
        // Aqui você pode adicionar o código para fazer o login no servidor
        // Exemplo: login(email, senha);
        return true;
    }

    return false;
}

function cadastrar(razao, email, telefone, responsavel, cnpj, senha){
    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            razaoSocialServer: razao,
            cnpjServer: cnpj,
            emailServer: email,
            telefoneServer: telefone,
            responsavelServer: responsavel,
            senhaServer: senha
        }),
    })
    .then(function (resposta) {
        console.log("resposta do servidor: ", resposta);
        if (resposta.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location = "login.html";
            limparFormulario();
        } else {
            return resposta.text();
        }
    })
    .then(function (erroTexto) {
        if (erroTexto) {
            console.log("Erro retornado do servidor:", erroTexto);
            mensagemErro.innerHTML = erroTexto;
        }
    })
    .catch(function (erro) {
        console.log("Erro na requisição:", erro);
        mensagemErro.innerHTML = "Erro ao tentar realizar o cadastro. Tente novamente.";
    });
}
