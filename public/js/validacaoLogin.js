function validacao(){
    var emailVar = ipt_email.value;
    var senhaVar = ipt_senha.value;

    if(emailVar == ""){
        mensagemErro.innerHTML = "**Insira os campos corretamente para acessar sua conta"
        return false;
    } else {
        MessageChannel.innerHTML = ""
    }
    if(senhaVar == ""){
        mensagemErro.innerHTML = "**Insira os campos corretamente para acessar sua conta"
        return false;
    } else {
        MessageChannel.innerHTML = ""
    }

    console.log("FORM LOGIN: ", emailVar);
    console.log("FORM SENHA: ", senhaVar);

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar
        })
    }).then(function (resposta) {
        console.log("ESTOU NO THEN DO entrar()!")

        if (resposta.ok) {
        resposta.json().then(json => {
            console.log(json);

            sessionStorage.EMAIL_USUARIO = json.email;
            sessionStorage.ID_USUARIO = json.idUsuario;

            window.location.href = "./dashboard/conta.html";
        });
    } else {
        console.log("Houve um erro ao tentar realizar o login!");
        resposta.text().then(texto => {
            console.error(texto);
            // finalizarAguardar(texto);
        });
    }


            // resposta.text().then(texto => {
            //     console.error(texto);
            //     finalizarAguardar(texto);
            // });

    }).catch(function (erro) {
        console.log(erro);
    })

    return false;
}