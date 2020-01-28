const express = require('express');

const app = express();
var projects = [], counter = 0;

app.use(express.json());

app.use((req, res, next) => {
    requestsCounter();

    return next();
});

// Middleware que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros 
// da URL que verifica se o projeto com aquele ID existe. Se não existir retorne um erro, caso 
// contrário permita a requisição continuar normalmente

function checkIfProjectExists(req, res, next){
    const { id } = req.params;
    
    if (projects.find( project => project.id == id ) == null){
        return res.status(400).json({ success: false, message:'Este id não foi cadastrado!', reponse: null });
    }

    return next();
}

// Middleware global chamado em todas requisições que imprime (console.log) uma contagem de 
// quantas requisições foram feitas na aplicação até então;

function requestsCounter(req, res, next){
    counter++;

    console.log(counter);
}


// POST /projects: 
// A rota deve receber id e title dentro do corpo e cadastrar um
// novo projeto dentro de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; 
// Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com aspas duplas.

app.post('/projects', (req, res) => {
    const { id, title } = req.body;

    projects.push({ 
        id,
        title,
        tasks: []
    });

    return res.json({ success: true, message:'Projeto criado com sucesso!', reponse: projects });
});

// GET /projects: 
// Rota que lista todos projetos e suas tarefas;

app.get('/projects', (req, res) => {
    return res.json({ success: true, message:'Projetos listados com sucesso!', reponse: projects });
});

// PUT /projects/:id: 
// A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;

app.put('/projects/:id', checkIfProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects.find( project => project.id == id ? project.title=title : null );

    return res.json({ success: true, message:'Projeto alterado com sucesso!', response: projects });
});

// DELETE /projects/:id: 
// A rota deve deletar o projeto com o id presente nos parâmetros da rota;

app.delete('/projects/:id', checkIfProjectExists, (req, res) => {
    const { id } = req.params;

    projects = projects.filter( project => project.id != id );

    return res.json({ success: true, message:'Projeto deletado com sucesso!', response: projects });
});

// POST /projects/:id/tasks: 
// A rota deve receber um campo title e armazenar uma nova tarefa no array 
// de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;

app.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
    const { id } = req.params;
    const { task_title } = req.body;
    
    projects.find( project => project.id == id ? project.tasks.push(task_title) : null );

    return res.json({ success: true, message:'Tarefa adicionada com sucesso!', response: projects });
});

app.listen(3000);