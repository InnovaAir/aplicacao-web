function validarFormulario() {
    // Recuperando os valores dos inputs
    var razaoVar = ipt_razao_social.value;
    var emailVar = ipt_email.value;
    var telefoneVar = ipt_telefone.value;
    var responsavelVar = ipt_responsavel.value;
    var cnpjVar = ipt_cnpj.value;
    var senhaVar = ipt_senha.value;
    var confirmarSenhaVar = ipt_confirmar_senha.value;

    var tamanho_senha = senhaVar.length;
    var senhaValida = true;
    var senhaConfirmadaValida = false;
    var emailValido = false;

    // Limpar mensagens de erro anteriores
    limparMensagensErro();

    // Verificar se os campos obrigatórios estão preenchidos
    if (razaoVar == "" || emailVar == "" || telefoneVar == "" || responsavelVar == "" || cnpjVar == "" || senhaVar == "" || confirmarSenhaVar == "") {
        mostrarErro(ipt_razao_social, "Preencha todos os campos obrigatórios para prosseguir");
        return false;
    }

    // Validação de E-mail
    if (emailVar.includes('.') && emailVar.includes('@')) {
        if (!(emailVar.indexOf('.') == (emailVar.indexOf('@') + 1))) {
            mostrarErro(ipt_email, "E-mail válido.");
            emailValido = true;
        }
    } else {
        mostrarErro(ipt_email, "E-mail inválido.");
    }

    // Validação de Senha
    if (senhaVar.toUpperCase() == senhaVar && senhaVar.toLowerCase() == senhaVar) {
        mostrarErro(ipt_senha, "Senha não possui letras.");
        senhaValida = false;
    }

    if (senhaVar.toLowerCase() == senhaVar) {
        mostrarErro(ipt_senha, "Senha não possui caracteres maiúsculos.");
        senhaValida = false;
    } else {
        mostrarErro(ipt_senha, "Senha possui caracteres maiúsculos.");
    }

    if (senhaVar.toUpperCase() == senhaVar) {
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
    if (!possuiNumero.test(senhaVar)) {
        mostrarErro(ipt_senha, "Senha não possui números.");
        senhaValida = false;
    } else {
        mostrarErro(ipt_senha, "Senha possui números.");
    }

    var possuiCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;
    if (!possuiCaracterEspecial.test(senhaVar)) {
        mostrarErro(ipt_senha, "Senha não contém caractere especial.");
        senhaValida = false;
    } else {
        mostrarErro(ipt_senha, "Senha contém caractere especial.");
    }

    // Validando a confirmação da senha
    if (senhaVar === confirmarSenhaVar) {
        mostrarErro(ipt_confirmar_senha, "As senhas são iguais.");
        senhaConfirmadaValida = true;
    } else {
        mostrarErro(ipt_confirmar_senha, "As senhas não coincidem.");
    }

    // Validação do CNPJ
    if (!validarCNPJ(cnpjVar)) {
        mostrarErro(ipt_cnpj, "CNPJ inválido.");
    }

    // Se todos os campos forem válidos
    if (emailValido && senhaValida && senhaConfirmadaValida) {
        alert("Cadastro realizado com sucesso!");
    }
}

// Função para mostrar as mensagens de erro
function mostrarErro(input, mensagem) { 
    var divErro = document.createElement("div");
    divErro.classList.add("erro");
    divErro.innerHTML = mensagem;
    var parentDiv = input.parentNode;
    if (parentDiv.querySelector(".erro") === null) {
        parentDiv.appendChild(divErro);
    }
}

// Função para limpar as mensagens de erro
function limparMensagensErro() {
    var mensagensErro = document.querySelectorAll(".erro");
    mensagensErro.forEach(function (erro) {
        erro.remove();
    });
}

// Função para validar o CNPJ (simples exemplo de regex)
function validarCNPJ(cnpj) {
    var regexCNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return regexCNPJ.test(cnpj);
}