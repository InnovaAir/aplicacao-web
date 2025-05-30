function validacao() {
    limparMensagensErro();
  
    let formularioValido = true;
    let emailValido = false;
    let senhaValida = true;
  
    let ipt_email = document.getElementById("ipt_email");
    let ipt_senha = document.getElementById("ipt_senha");
  
    let email = ipt_email.value.trim();
    let senha = ipt_senha.value;
  
    // Verificações de campos obrigatórios
    if (email === "") {
      mostrarErro(ipt_email, "Preencha o e-mail.", "email");
      formularioValido = false;
    }
  
    if (senha === "") {
      mostrarErro(ipt_senha, "Preencha a senha.", "senha");
      formularioValido = false;
    }
  
    if (!formularioValido) return false;
  
    // Validação de e-mail
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    if (regexEmail.test(email)) {
      emailValido = true;
    } else {
      mostrarErro(ipt_email, "E-mail inválido.", "email");
      formularioValido = false;
    }
  
    // Validação da senha
    if (senha.length < 8) {
      mostrarErro(ipt_senha, "Senha deve ter pelo menos 8 caracteres.", "senha");
      senhaValida = false;
    }
    if (senha === senha.toUpperCase()) {
      mostrarErro(ipt_senha, "Senha deve conter letras minúsculas.", "senha");
      senhaValida = false;
    }
    if (senha === senha.toLowerCase()) {
      mostrarErro(ipt_senha, "Senha deve conter letras maiúsculas.", "senha");
      senhaValida = false;
    }
    if (!/\d/.test(senha)) {
      mostrarErro(ipt_senha, "Senha deve conter pelo menos um número.", "senha");
      senhaValida = false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
      mostrarErro(ipt_senha, "Senha deve conter um caractere especial.", "senha");
      senhaValida = false;
    }
  
    // Verificação final
    if (formularioValido && emailValido && senhaValida) {
        entrar(email, senha);
        return true;
    }
  
    return false;
}
  
  function mostrarErro(input, mensagem, tipoErro) {
    // Escolher o contêiner de erro adequado com base no tipo de erro
    let erroDiv;
    if (tipoErro === "email") {
      erroDiv = input.parentNode.querySelector(".erro-container-email");
    } else if (tipoErro === "senha") {
      erroDiv = input.parentNode.querySelector(".erro-container-senha");
    }
  
    if (erroDiv) {
      erroDiv.innerHTML = `<span class="erro">${mensagem}</span>`;
    }
  }
  
  function limparMensagensErro() {
    // Limpar as mensagens de erro para todos os campos
    for (const container of document.querySelectorAll(".erro-container-email, .erro-container-senha")) {
      container.innerHTML = "";
    }
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
                sessionStorage.idUsuario = json.idUsuario;
                sessionStorage.idFilial = json.idFilial;
                sessionStorage.fkCliente = json.fkCliente;
                sessionStorage.fkCargo = json.fkCargo;
                if (json.fkCargo == 1){
                    let timerInterval;
                    Swal.fire({
                      icon: "success",
                      title: "Login efetuado com sucesso!",
                      html: "Redirecionando... <b></b>",
                      timer: 1350,
                      timerProgressBar: true,
                      didOpen: () => {
                        Swal.showLoading();
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                          timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                      },
                      willClose: () => {
                        clearInterval(timerInterval);
                      }
                    }).then((result) => {
                      /* Read more about handling dismissals below */
                      if (result.dismiss === Swal.DismissReason.timer) {
                        console.log("I was closed by the timer");
                      }
                    });
                    setTimeout(function () {
                        window.location = "./cadastroEmpresa.html";
                    }, 1350); // apenas para exibir o loading
                }else if (json.fkCargo == 2){
                    let timerInterval;
                    Swal.fire({
                      icon: "success",
                      title: "Login efetuado com sucesso!",
                      html: "Redirecionando... <b></b>",
                      timer: 1350,
                      timerProgressBar: true,
                      didOpen: () => {
                        Swal.showLoading();
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                          timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                      },
                      willClose: () => {
                        clearInterval(timerInterval);
                      }
                    }).then((result) => {
                      /* Read more about handling dismissals below */
                      if (result.dismiss === Swal.DismissReason.timer) {
                        console.log("I was closed by the timer");
                      }
                    });
                    setTimeout(function () {
                        window.location = "./dashboard/roberto_Lucas.html";
                    }, 1350); // apenas para exibir o loading
                }else if (json.fkCargo == 3){
                    let timerInterval;
                    Swal.fire({
                      icon: "success",
                      title: "Login efetuado com sucesso!",
                      html: "Redirecionando... <b></b>",
                      timer: 1350,
                      timerProgressBar: true,
                      didOpen: () => {
                        Swal.showLoading();
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                          timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                      },
                      willClose: () => {
                        clearInterval(timerInterval);
                      }
                    }).then((result) => {
                      /* Read more about handling dismissals below */
                      if (result.dismiss === Swal.DismissReason.timer) {
                        console.log("I was closed by the timer");
                      }
                    });
                    setTimeout(function () {
                        window.location = "./dashboard/dashboard_analista.html";
                    }, 1350); // apenas para exibir o loading
                }else if (json.fkCargo == 4){
                    let timerInterval;
                    Swal.fire({
                      icon: "success",
                      title: "Login efetuado com sucesso!",
                      html: "Redirecionando... <b></b>",
                      timer: 1350,
                      timerProgressBar: true,
                      didOpen: () => {
                        Swal.showLoading();
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                          timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                      },
                      willClose: () => {
                        clearInterval(timerInterval);
                      }
                    }).then((result) => {
                      /* Read more about handling dismissals below */
                      if (result.dismiss === Swal.DismissReason.timer) {
                        console.log("I was closed by the timer");
                      }
                    });
                    setTimeout(function () {
                        window.location = "./dashboard/visaoGeral.html";
                    }, 1350); // apenas para exibir o loading
                }
            })
        } else {
            console.log("Houve um erro ao tentar realizar o login!");

            //Adicionando uma mensagem, para aparecer quando o usuario digitar algo que não foi cadastrado
            mostrarErro(document.getElementById("ipt_senha") , "Nome de usuário ou senha não cadastrados!", "senha");
            resposta.text().then(texto => {
                console.error(texto);
            });
        }

    })
}