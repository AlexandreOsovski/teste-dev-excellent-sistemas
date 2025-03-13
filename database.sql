DROP DATABASE IF EXISTS excellent_teste_dev;

CREATE DATABASE excellent_teste_dev;

USE excellent_teste_dev;

DROP TABLE IF EXISTS status;

CREATE TABLE
    status (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL UNIQUE,
        dataCriado DATETIME DEFAULT CURRENT_TIMESTAMP,
        dataAlterado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

INSERT INTO
    status (nome)
VALUES
    ('ativo'),
    ('inativo'),
    ('indisponivel'),
    ('pendente'),
    ('andamento'),
    ('finalizado'),
    ('cancelado');

DROP TABLE IF EXISTS cliente;

CREATE TABLE
    cliente (
        id INT PRIMARY KEY AUTO_INCREMENT,
        razao_social VARCHAR(255) NOT NULL,
        cnpj VARCHAR(18) NOT NULL,
        email VARCHAR(255) NOT NULL,
        status_id INT,
        UNIQUE (cnpj),
        UNIQUE (email),
        dataCriado DATETIME DEFAULT CURRENT_TIMESTAMP,
        dataAlterado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (status_id) REFERENCES status (id)
    );

DROP TABLE IF EXISTS produto;

CREATE TABLE
    produto (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        valor DECIMAL(10, 2) NOT NULL,
        desconto DECIMAL(10, 2) DEFAULT NULL,
        quantidade_estoque INT NOT NULL,
        status_id INT,
        dataCriado DATETIME DEFAULT CURRENT_TIMESTAMP,
        dataAlterado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (status_id) REFERENCES status (id)
    );

DROP TABLE IF EXISTS produto_imagem;

CREATE TABLE
    produto_imagem (
        id INT PRIMARY KEY AUTO_INCREMENT,
        idproduto INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        dataCriado DATETIME DEFAULT CURRENT_TIMESTAMP,
        dataAlterado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (idproduto) REFERENCES produto (id)
    );

DROP TABLE IF EXISTS pedido;

CREATE TABLE
    pedido (
        id INT PRIMARY KEY AUTO_INCREMENT,
        idcliente INT NOT NULL,
        idproduto INT NOT NULL,
        quantidade INT NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        total_desconto DECIMAL(10, 2) NOT NULL,
        valor_unitario DECIMAL(10, 2) NOT NULL,
        status_id INT,
        dataCriado DATETIME DEFAULT CURRENT_TIMESTAMP,
        dataAlterado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (idcliente) REFERENCES cliente (id),
        FOREIGN KEY (idproduto) REFERENCES produto (id),
        FOREIGN KEY (status_id) REFERENCES status (id)
    );