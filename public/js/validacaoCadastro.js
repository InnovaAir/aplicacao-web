function cadastrar(){
    var razaoVar = ipt_razao_social.value;
    var emailVar = ipt_email.value;
    var telefoneVar = ipt_telefone.value;
    var responsavelVar = ipt_responsavel.value;
    var cnpjVar = ipt_cnpj.value;
    var senhaVar = ipt_senha.value;
    var confirmarSenhaVar = ipt_confirmar_senha.value;

    if(razaoVar == "" || emailVar == "" || telefoneVar == "" || responsavelVar == "" || senhaVar == "" || confirmarSenhaVar == "" || cnpjVar == ""){
        mensagemErro.innerHTML = "**Complete todos os campos para realizar seu cadastro"
        return false;
    }

    if(emailVar.includes('@') && emailVar.includes('.')){

    } else {
                mensagemErro.innerHTML = "**Email Inválido. Precisa conter @ e ."
    }

    if(!senha.includes(1) 
        || !senha.includes(2)
        || !senha.includes(3)
        || !senha.includes(4)
        || !senha.includes(5)
        || !senha.includes(6)
        || !senha.includes(7)
        || !senha.includes(8)
        || !senha.includes(9)
        || !senha.includes(0)){
            mensagemErro.innerHTML = "**A senha deve incluir pelo menos um número"
        }

    if (senhaVar != confirmarSenhaVar){
        mensagemErro.innerHTML = "**As senhas não coincidem"
    }

    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // crie um atributo que recebe o valor recuperado aqui
          // Agora vá para o arquivo routes/usuario.js
          razaoServer: razaoVar,
          emailServer: emailVar,
          telefoneServer: telefoneVar,
          responsavelServer: responsavelVar,
          cnpjServer: cnpjVar,
          senhaServer: senhaVar,
          confirmarServer: confirmarSenhaVar
        }),
      })
        .then(function (resposta) {
          console.log("resposta: ", resposta);
  
           if (resposta.ok) {
            
            alert('Cadastro realizado com sucesso!')
            window.location = "login.html";

            limparFormulario();
           } else {
            throw "Houve um erro ao tentar realizar o cadastro!";
          }
        })
        .catch(function (resposta) {
          console.log(`#ERRO: ${resposta}`);
        });
  
      return false;
    }
