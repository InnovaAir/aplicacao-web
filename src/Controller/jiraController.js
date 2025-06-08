async function buscarChamados(req, res) {
    var jql = req.body.jql;

    const jiraBaseUrl = 'https://inovaair.atlassian.net';
    const apiToken = '';
    const email = 'diogo.tateno@sptech.school';

    const headers = {
        'Authorization': `Basic ${btoa(`${email}:${apiToken}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`${jiraBaseUrl}/rest/api/3/search`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                jql: jql,
                maxResults: 120,
                fields: ['summary', 'status', 'assignee', 'created']
            })
        });
        
        const data = await response.json();

        res.status(200).send(data);
    } catch (error) {
        console.error('Erro ao buscar chamados:', error);
    }
}

module.exports = {
    buscarChamados,
};