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
    `cliente` (
        `id` int NOT NULL AUTO_INCREMENT,
        `razao_social` varchar(255) NOT NULL,
        `cnpj` varchar(255) NOT NULL,
        `email` varchar(255) NOT NULL,
        `status_id` varchar(255) NOT NULL DEFAULT '1',
        `dataCriado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `dataAlterado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci
DROP TABLE IF EXISTS produto;

CREATE TABLE
    `produto` (
        `id` int NOT NULL AUTO_INCREMENT,
        `nome` varchar(255) NOT NULL,
        `descricao` varchar(255) NOT NULL,
        `valor` decimal(10, 2) NOT NULL,
        `desconto` decimal(10, 2) DEFAULT NULL,
        `quantidade_estoque` int NOT NULL,
        `status` varchar(255) NOT NULL DEFAULT 'ativo',
        `dataCriado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `dataAlterado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci
DROP TABLE IF EXISTS produto_imagem;

CREATE TABLE
    `produto_imagem` (
        `id` int NOT NULL AUTO_INCREMENT,
        `url` varchar(255) NOT NULL,
        `idproduto` int NOT NULL,
        PRIMARY KEY (`id`),
        KEY `FK_f17f4b3ec498e8d3f0d6bd548b2` (`idproduto`),
        CONSTRAINT `FK_f17f4b3ec498e8d3f0d6bd548b2` FOREIGN KEY (`idproduto`) REFERENCES `produto` (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci
DROP TABLE IF EXISTS pedido;

CREATE TABLE
    `pedido` (
        `id` int NOT NULL AUTO_INCREMENT,
        `status` varchar(255) NOT NULL DEFAULT 'pendente',
        `dataCriado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `dataAlterado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `id_cliente` int DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `FK_33471ba0a166506dbd244346ba6` (`id_cliente`),
        CONSTRAINT `FK_33471ba0a166506dbd244346ba6` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci
DROP TABLE IF EXISTS item_pedido;

CREATE TABLE
    `item_pedido` (
        `id` int NOT NULL AUTO_INCREMENT,
        `quantidade` int NOT NULL,
        `valor_unitario` decimal(10, 2) NOT NULL,
        `total` decimal(10, 2) NOT NULL,
        `total_desconto` decimal(10, 2) NOT NULL,
        `dataCriado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `dataAlterado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `id_pedido` int DEFAULT NULL,
        `id_produto` int DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `FK_b8a06a055ed50f426d61b625515` (`id_pedido`),
        KEY `FK_24b16ca61542e380e35a21303cd` (`id_produto`),
        CONSTRAINT `FK_24b16ca61542e380e35a21303cd` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id`),
        CONSTRAINT `FK_b8a06a055ed50f426d61b625515` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci