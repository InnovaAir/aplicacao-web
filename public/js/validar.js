function validarFormulario() {
    // Recuperando os valores dos inputs
    var razao = ipt_razao_social.value.trim();
    var email = ipt_email.value.trim();
    var telefone = ipt_telefone.value.trim();
    var responsavel = ipt_responsavel.value.trim();
    var cnpj = ipt_cnpj.value.trim();
    var senha = ipt_senha.value;
    var confSenha = ipt_confirmar_senha.value;

    // Limpa mensagens anteriores
    limparMensagensErro();

    // Verifica se há campos vazios
    if (!razao || !email || !telefone || !responsavel || !cnpj || !senha || !confSenha) {
        mostrarErro(ipt_razao_social, "Preencha todos os campos obrigatórios.");
        return false;
    }

    // Validação de e-mail
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var emailValido = regexEmail.test(email);
    if (!emailValido) {
        mostrarErro(ipt_email, "E-mail inválido.");
    }

    // Validação de senha
    var senhaValida = true;
    var errosSenha = [];

    if (senha.length < 8) errosSenha.push("A senha deve ter pelo menos 8 caracteres.");
    if (!/[A-Z]/.test(senha)) errosSenha.push("A senha deve conter pelo menos uma letra maiúscula.");
    if (!/[a-z]/.test(senha)) errosSenha.push("A senha deve conter pelo menos uma letra minúscula.");
    if (!/\d/.test(senha)) errosSenha.push("A senha deve conter pelo menos um número.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) errosSenha.push("A senha deve conter pelo menos um caractere especial.");

    if (errosSenha.length > 0) {
        senhaValida = false;
        mostrarErro(ipt_senha, errosSenha.join("<br>"));
    }

    // Verificação de confirmação de senha
    var senhaConfirmadaValida = senha === confSenha;
    if (!senhaConfirmadaValida) {
        mostrarErro(ipt_confirmar_senha, "As senhas não coincidem.");
    }

    // Validação de CNPJ
    var cnpjValido = validarCNPJ(cnpj);
    if (!cnpjValido) {
        mostrarErro(ipt_cnpj, "CNPJ inválido.");
    }

    // Se tudo estiver válido, envia os dados
    if (emailValido && senhaValida && senhaConfirmadaValida && cnpjValido) {
        fetch("/usuarios/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                razaoSocialServer: razao,
                emailServer: email,
                telefoneServer: telefone,
                responsavelServer: responsavel,
                cnpjServer: cnpj,
                senhaServer: senha,
                confServer: confSenha
            })
        })
        .then(resposta => {
            if (resposta.ok) {
                alert("Cadastro realizado com sucesso!");
                window.location = "login.html";
                limparFormulario();
            } else {
                return resposta.text().then(erroTexto => {
                    mensagemErro.innerHTML = erroTexto;
                });
            }
        })
        .catch(erro => {
            console.error("Erro na requisição:", erro);
            mensagemErro.innerHTML = "Erro ao tentar realizar o cadastro.";
        });
    }

    return false; // Evita envio padrão do formulário
}

// Mostrar erro
function mostrarErro(input, mensagem) {
    var divErro = document.createElement("div");
    divErro.classList.add("erro");
    divErro.innerHTML = mensagem;
    var parentDiv = input.parentNode;
    if (!parentDiv.querySelector(".erro")) {
        parentDiv.appendChild(divErro);
    }
}

// Limpa mensagens de erro
function limparMensagensErro() {
    document.querySelectorAll(".erro").forEach(erro => erro.remove());
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove tudo que não for número
    return cnpj.length === 14;
}