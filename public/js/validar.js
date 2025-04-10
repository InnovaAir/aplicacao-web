function validarFormulario() {
    // Recuperando os valores dos inputs
    var razao = ipt_razao_social.value;
    var email = ipt_email.value;
    var telefone = ipt_telefone.value;
    var responsavel = ipt_responsavel.value;
    var cnpj = ipt_cnpj.value;
    var senha = ipt_senha.value;
    var confSenha = ipt_confirmar_senha.value;

    var tamanho_senha = senha.length;
    var senhaValida = true;
    var senhaConfirmadaValida = false;
    var emailValido = false;

    console.log("Dados antes de enviar:", {
        razao,
        email,
        telefone,
        responsavel,
        cnpj,
        senha,
        confSenha
    });

    // Limpando mensagens anteriores
    limparMensagensErro();

    // Verificar se os capos estão vazios
    if (razao == "" || email == "" || telefone == "" || responsavel == "" || cnpj == "" || senha == "" || confSenha == "") {
        mostrarErro(ipt_razao_social, "Preencha todos os campos obrigatórios para prosseguir");
        return false;
    }

    // Validndo E-mail
    if (email.includes('.') && email.includes('@')) {
        if (!(email.indexOf('.') == (email.indexOf('@') + 1))) {
            mostrarErro(ipt_email, "E-mail válido.");
            emailValido = true;
        }
    } else {
        mostrarErro(ipt_email, "E-mail inválido.");
    }

    // Validando Senha
    if (senha.toUpperCase() == senha && senha.toLowerCase() == senha) {
        mostrarErro(ipt_senha, "Senha não possui letras.");
        senhaValida = false;
    }

    if (senha.toLowerCase() == senha) {
        mostrarErro(ipt_senha, "Senha não possui caracteres maiúsculos.");
        senhaValida = false;
    } else {
        mostrarErro(ipt_senha, "Senha possui caracteres maiúsculos.");
    }

    if (senha.toUpperCase() == senha) {
        mostrarErro(ipt_senha, "Senha não possui caracteres minúsculos.");
        senhaValida = false;
    } else {
        mostrarErro(ipt_senha, "Senha possui caracteres minúsculos.");
    }

    if (tamanho_senha < 8) {
        mostrarErro(ipt_senha, "Senha não possui menos de 8 caracteres.");
        senhaValida = false;
    } else {
        mostrarErro(ipt_senha, "Senha possui pelo menos 8 caracteres.");
    }

    var possuiNumero = /\d/;
    if (!possuiNumero.test(senha)) {
        mostrarErro(ipt_senha, "Senha não possui números.");
        senhaValida = false;
    } else {
        mostrarErro(ipt_senha, "Senha possui números.");
    }

    var possuiCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;
    if (!possuiCaracterEspecial.test(senha)) {
        mostrarErro(ipt_senha, "Senha não contém caractere especial.");
        senhaValida = false;
    } else {
        mostrarErro(ipt_senha, "Senha contém caractere especial.");
    }

    // Validando a confirmação da senha
    if (senha === confSenha) {
        mostrarErro(ipt_confirmar_senha, "As senhas são iguais.");
        senhaConfirmadaValida = true;
    } else {
        mostrarErro(ipt_confirmar_senha, "As senhas não coincidem.");
    }

    // Validação do CNPJ
    if (!validarCNPJ(cnpj)) {
        mostrarErro(ipt_cnpj, "CNPJ inválido.");
    }

    // Todos os campos forem válidos
    if (emailValido && senhaValida && senhaConfirmadaValida) {
        alert("Cadastro realizado com sucesso!");
    }


// Função mensagem de erro
function mostrarErro(input, mensagem) { 
    var divErro = document.createElement("div");
    divErro.classList.add("erro");
    divErro.innerHTML = mensagem;
    var parentDiv = input.parentNode;
    if (parentDiv.querySelector(".erro") === null) {
        parentDiv.appendChild(divErro);
    }
}

// Função limpar as mensagens
function limparMensagensErro() {
    var mensagensErro = document.querySelectorAll(".erro");
    mensagensErro.forEach(function (erro) {
        erro.remove();
    });
}

// Função validar CNPJ
function validarCNPJ(cnpj) {
    var regexCNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return regexCNPJ.test(cnpj);
}

fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        razaoSocialServer: razao,
        emailServer: email,
        telefoneServer: telefone,
        responsavelServer: responsavel,
        cnpjServer: cnpj,
        senhaServer: senha,
        confServer: confSenha
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