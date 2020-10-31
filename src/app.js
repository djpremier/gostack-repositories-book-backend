const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(repo => repo.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  }

  repositories[repositoryIndex] = repository

  return response.status(200).json(repository);
});

app.patch("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repositoryOriginal = repositories[repositoryIndex];

  const newTitle = title || repositoryOriginal.title;
  const newUrl = url || repositoryOriginal.url;
  const newTechs = techs || repositoryOriginal.techs;

  repository = {
    ...repositoryOriginal,
    title: newTitle,
    url: newUrl,
    techs: newTechs,
  }

  repositories[repositoryIndex] = repository

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);
  
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repository = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1,
  }

  repositories[repositoryIndex] = repository

  return response.status(200).json(repository);
});

module.exports = app;
