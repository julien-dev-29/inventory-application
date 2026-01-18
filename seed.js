import { Client } from "pg";
import "dotenv/config";

const SQL = `
DROP TABLE IF EXISTS snippet_projects;
DROP TABLE IF EXISTS snippet_tags;
DROP TABLE IF EXISTS snippets;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_sessions;

-- Création des tables
CREATE TABLE user_sessions (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMPTZ NOT NULL
);

CREATE TABLE users(
   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   password VARCHAR(255) UNIQUE NOT NULL,
   admin BOOLEAN DEFAULT false
);

CREATE TABLE languages(
   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tags(
   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE projects(
   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   name VARCHAR(50) NOT NULL,
   description TEXT,
   github_repo VARCHAR(255)
);

CREATE TABLE snippets(
   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   title VARCHAR(50) NOT NULL,
   code TEXT,
   description TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   complexity VARCHAR(20),
   is_public BOOLEAN DEFAULT FALSE,
   language_id INTEGER NOT NULL,
   FOREIGN KEY(language_id) REFERENCES languages(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE snippet_tags(
   snippet_id INT NOT NULL,
   tag_id INT NOT NULL,
   PRIMARY KEY(snippet_id, tag_id),
   FOREIGN KEY(snippet_id) REFERENCES snippets(id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE snippet_projects(
   snippet_id INT NOT NULL,
   project_id INT NOT NULL,
   PRIMARY KEY(snippet_id, project_id),
   FOREIGN KEY(snippet_id) REFERENCES snippets(id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_snippets_updated_at
BEFORE UPDATE ON snippets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_snippets_language_id ON snippets(language_id);
CREATE INDEX idx_snippets_complexity ON snippets(complexity);

INSERT INTO languages (name) VALUES
('JavaScript'),
('Python'),
('Java'),
('C#'),
('Ruby'),
('Go'),
('PHP'),
('C++'),
('TypeScript'),
('Swift');

INSERT INTO tags (name) VALUES
('algorithm'),
('data-structure'),
('database'),
('api'),
('authentication'),
('frontend'),
('backend'),
('devops'),
('testing'),
('performance');

INSERT INTO projects (name, description, github_repo) VALUES
('Inventory App', 'An application to manage inventory items.', 'https://github.com/user/inventory-app'),
('Blog Platform', 'A platform for creating and managing blogs.', 'https://github.com/user/blog-platform'),
('E-commerce Site', 'An online store for various products.', 'https://github.com/user/e-commerce-site');

INSERT INTO snippets (title, code, description, complexity, is_public, language_id) VALUES
('Bubble Sort', 'function bubbleSort(arr) { /*...*/ }', 'A simple bubble sort implementation.', 'easy', true, 4),
('Quick Sort', 'function quickSort(arr) { /*...*/ }', 'An efficient quick sort implementation.', 'medium', true, 4),
('Merge Sort', 'function mergeSort(arr) { /*...*/ }', 'A divide and conquer merge sort implementation.', 'hard', false, 1),
('Binary Search Tree', 'class BST { /*...*/ }', 'Implementation of a binary search tree.', 'medium', true, 2),
('Linked List', 'class LinkedList { /*...*/ }', 'A simple linked list implementation.', 'easy', true, 2),
('REST API with Flask', 'from flask import Flask, jsonify', 'A basic REST API using Flask.', 'medium', false, 2),
('Java Streams Example', 'import java.util.stream.*;', 'Using Java Streams for data processing.', 'hard', true, 3),
('C# LINQ Example', 'using System.Linq;', 'Using LINQ in C# for data queries.', 'medium', true, 4),
('Ruby on Rails Basics', 'class ApplicationController < ActionController::Base', 'Getting started with Ruby on Rails.', 'easy', false, 5),
('Go Concurrency', 'go func() { /*...*/ }()', 'An introduction to concurrency in Go.', 'hard', true, 6),
('PHP PDO Example', '$pdo = new PDO($dsn, $user, $password);', 'Using PDO for database access in PHP.', 'medium', true, 7),
('C++ STL Example', '#include <vector>', 'Using the Standard Template Library in C++.', 'easy', false, 8),
('TypeScript Interfaces', 'interface User { name: string; age: number; }', 'Defining interfaces in TypeScript.', 'easy', true, 9),
('Swift Optionals', 'var name: String?', 'Understanding optionals in Swift.', 'medium', true, 10),
('Dijkstra''s Algorithm', 'function dijkstra(graph, start) { /*...*/ }', 'Finding the shortest path in a graph.', 'hard', false, 1),
('Hash Table Implementation', 'class HashTable { /*...*/ }', 'A simple hash table implementation.', 'medium', true, 1), 
('Python Decorators', 'def my_decorator(func): /*...*/', 'Understanding decorators in Python.', 'easy', true, 2),
('Java Generics', 'public class Box<T> { /*...*/ }', 'Using generics in Java.', 'medium', false, 3),
('C# Async/Await', 'public async Task MyMethod() { /*...*/ }', 'Asynchronous programming in C#.', 'hard', true, 4),
('Ruby Blocks', 'def my_method(&block) /*...*/ end', 'Using blocks in Ruby.', 'easy', true, 5),
('Go Interfaces', 'type Reader interface { Read(p []byte) (n int, err error) }', 'Understanding interfaces in Go.', 'medium', true, 6);

INSERT INTO snippet_tags (snippet_id, tag_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 4),
(7, 5),
(8, 5),
(9, 5),
(10, 3),
(11, 5),
(12, 5),
(13, 3),
(14, 3),
(15, 3),
(16, 2),
(17, 2),
(18, 2),
(19, 3),
(20, 3),
(21, 3);

INSERT INTO snippet_projects (snippet_id, project_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(6, 2),
(7, 3),
(8, 3),
(9, 3),
(10, 1),
(11, 1),
(12, 1),
(13, 2),
(14, 2),
(15, 2),
(16, 3),
(17, 3),
(18, 3),
(19, 1),
(20, 1),
(21, 1);
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  try {
    await client.connect();
    await client.query(SQL);
    console.log("Done!");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    await client.end();
  }
}

main();
