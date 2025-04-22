function validacao() {
    var emailInput = document.getElementById("ipt_email");
    var senhaInput = document.getElementById("ipt_senha");
    var mensagemErro = document.getElementById("mensagemErro");
    var email = emailInput.value.trim();
    var senha = senhaInput.value;

    // Limpa mensagens anteriores
    mensagemErro.innerHTML = "";

    let erros = [];

    // Validação de campos vazios
    if (!email || !senha) {
        erros.push("Preencha todos os campos.");
    }

    // Validação de e-mail
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !regexEmail.test(email)) {
        erros.push("E-mail inválido.");
    }

    if (erros.length > 0) {
        mensagemErro.innerHTML = erros.join("<br>");
        return false;
    }else{
        // Requisição para login
        entrar(email, senha);
    }

    return false;
}

function entrar(email, senha){
    fetch("/usuarios/entrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: email,
            senhaServer: senha
        })
    }).then(function (resposta) {
        console.log("ESTOU NO THEN DO entrar()!")

        if (resposta.ok) {
            console.log(resposta);

            resposta.json().then(json => {
                console.log(json);
                console.log(JSON.stringify(json));
                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.ID_USUARIO = json.id;
                alert("Login Realizado com sucesso!");
                // alterando redirecionamento para pagina index
                setTimeout(function () {
                    window.location = "./dashboard/temporeal.html";
                }, 1000); // apenas para exibir o loading
            });
        } else {
            console.log("Houve um erro ao tentar realizar o login!");

            //Adicionando uma mensagem, para aparecer quando o usuario digitar algo que não foi cadastrado
            div_mensagem.innerHTML = `<span style='color:#ff0000; font-weight:bold;'>Nome de usuário ou senha invalidos</span><br>`;
            resposta.text().then(texto => {
                console.error(texto);
            });
        }

    })
}