import { Client } from 'pg';
import 'dotenv/config';

const SQL = `
DROP TABLE IF EXISTS snippet_projects;
DROP TABLE IF EXISTS snippet_tags;
DROP TABLE IF EXISTS snippets;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS languages;

-- Création des tables
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
   complexity VARCHAR(20) CHECK (complexity IN ('Débutant', 'Intermédiaire', 'Avancé')),
   is_public BOOLEAN DEFAULT FALSE,
   language_id INTEGER NOT NULL,
   FOREIGN KEY(language_id) REFERENCES languages(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Le reste du script reste inchangé
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

-- Trigger pour updated_at
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

-- Index pour les performances
CREATE INDEX idx_snippets_language_id ON snippets(language_id);
CREATE INDEX idx_snippets_complexity ON snippets(complexity);

-- Données (inchangées)
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
('Bubble Sort', 'function bubbleSort(arr) { /* sorting logic */ }', 'A simple bubble sort algorithm.', 'Débutant', TRUE, 1),
('Quick Sort', 'function quickSort(arr) { /* sorting logic */ }', 'An efficient quick sort algorithm.', 'Intermédiaire', TRUE, 1),
('Merge Sort', 'function mergeSort(arr) { /* sorting logic */ }', 'A divide and conquer merge sort algorithm.', 'Avancé', FALSE, 1),
('Binary Search', 'def binary_search(arr, target): # search logic', 'A binary search algorithm in Python.', 'Débutant', TRUE, 2),
('Dijkstra''s Algorithm', 'def dijkstra(graph, start): # algorithm logic', 'An implementation of Dijkstra''s shortest path algorithm.', 'Avancé', FALSE, 2),
('REST API with Flask', 'from flask import Flask # API logic', 'A simple REST API using Flask framework.', 'Intermédiaire', TRUE, 2),
('Singleton Pattern in Java', 'public class Singleton { // pattern logic }', 'An example of Singleton design pattern in Java.', 'Intermédiaire', TRUE, 3),
('Factory Pattern in Java', 'public class Factory { // pattern logic }', 'An example of Factory design pattern in Java.', 'Avancé', FALSE, 3),
('Observer Pattern in Java', 'public class Observer { // pattern logic }', 'An example of Observer design pattern in Java.', 'Avancé', FALSE, 3),
('LINQ Query Example', 'var result = from item in collection where item.Property == value select item;', 'An example of a LINQ query in C#.', 'Débutant', TRUE, 4),
('Async/Await in C#', 'public async Task MethodAsync() { // async logic }', 'An example of using async/await in C#.', 'Intermédiaire', TRUE, 4),
('Dependency Injection in C#', 'public class Service { // DI logic }', 'An example of Dependency Injection in C#.', 'Avancé', FALSE, 4),
('Rails Model Example', 'class User < ApplicationRecord # model logic end', 'An example of a Rails model.', 'Débutant', TRUE, 5),
('Active Record Associations', 'class Post < ApplicationRecord has_many :comments end', 'An example of Active Record associations in Rails.', 'Intermédiaire', TRUE, 5),
('RSpec Test Example', 'describe \"MyClass\" do it \"does something\" end end', 'An example of an RSpec test in Ruby.', 'Avancé', FALSE, 5),
('Goroutines in Go', 'go func() { // concurrent logic }()', 'An example of using goroutines for concurrency in Go.', 'Intermédiaire', TRUE, 6),
('Channels in Go', 'ch := make(chan int) // channel logic', 'An example of using channels for communication in Go.', 'Avancé', FALSE, 6),
('HTTP Server in Go', 'http.HandleFunc(\"/\", handler) // server logic', 'An example of a simple HTTP server in Go.', 'Débutant', TRUE, 6),
('PDO Connection in PHP', '$pdo = new PDO($dsn, $user, $password); // connection logic', 'An example of connecting to a database using PDO in PHP.', 'Débutant', TRUE, 7),
('Prepared Statements in PHP', '$stmt = $pdo->prepare(\"SELECT * FROM table WHERE id = ?\"); // statement logic', 'An example of using prepared statements in PHP.', 'Intermédiaire', TRUE, 7),
('Laravel Eloquent Example', 'class User extends Model { // model logic }', 'An example of an Eloquent model in Laravel.', 'Avancé', FALSE, 7),
('STL Vector Example in C++', '#include <vector> std::vector<int> vec; // vector logic', 'An example of using STL vectors in C++.', 'Débutant', TRUE, 8),
('Smart Pointers in C++', '#include <memory> std::unique_ptr<int> ptr(new int); // smart pointer logic', 'An example of using smart pointers in C++.', 'Avancé', FALSE, 8),
('Lambda Expressions in C++', 'auto add = [](int a, int b) { return a + b; }; // lambda logic', 'An example of using lambda expressions in C++.', 'Intermédiaire', TRUE, 8),
('TypeScript Interface Example', 'interface User { name: string; age: number; } // interface logic', 'An example of defining an interface in TypeScript.', 'Débutant', TRUE, 9),
('Generics in TypeScript', 'function identity<T>(arg: T): T { return arg; } // generics logic', 'An example of using generics in TypeScript.', 'Intermédiaire', TRUE, 9),
('Decorators in TypeScript', 'function log(target: any, key: string) { // decorator logic } // decorator logic', 'An example of using decorators in TypeScript.', 'Avancé', FALSE, 9),
('Swift Optionals', 'var name: String? = nil // optional logic', 'An example of using optionals in Swift.', 'Débutant', TRUE, 10),
('Closures in Swift', 'let closure = { (param: Int) -> Int in return param * 2 } // closure logic', 'An example of using closures in Swift.', 'Intermédiaire', TRUE, 10),
('Protocol-Oriented Programming in Swift', 'protocol Drawable { func draw() } // protocol logic', 'An example of protocol-oriented programming in Swift.', 'Avancé', FALSE, 10);

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
      console.log('Done!');
   } catch (err) {
      console.error('Error during seeding:', err);
   } finally {
      await client.end();
   }
}

main();
