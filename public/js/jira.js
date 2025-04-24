async function criarChamadoJira(email, empresa) {
    const url = "https://SUA-ORGANIZACAO.atlassian.net/rest/api/3/issue";
    const auth = btoa("SEU-EMAIL:JIRA-TOKEN");
  
    const body = {
      fields: {
        project: { key: "PROJ" },
        summary: `Solicitação de acesso para empresa ${empresa}`,
        description: `E-mail: ${email}\nEmpresa: ${empresa}`,
        issuetype: { name: "Task" }
      }
    };
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  
    const data = await response.json();
    if (response.ok) {
      alert("Solicitação enviada com sucesso! ID do chamado: " + data.key);
    } else {
      alert("Erro ao enviar solicitação: " + data.errorMessages);
    }
  }