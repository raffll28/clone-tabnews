// pages/index.js

import React from "react";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#e0f7fa",
      }}
    >
      {/* Barra Lateral Esquerda */}
      <aside
        style={{
          width: "200px",
          backgroundColor: "#0288d1",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Menu</h2>
        <ul style={{ listStyle: "none", padding: 1 }}>
          <li>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>
              Home
            </a>
          </li>
          <li>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>
              Sobre
            </a>
          </li>
          <li>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>
              Contato
            </a>
          </li>
          <li>
            <a
              href="api/v1/status"
              style={{ color: "white", textDecoration: "none" }}
            >
              API
            </a>
          </li>
        </ul>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, padding: "20px" }}>
        {/* Cabeçalho */}
        <header
          style={{
            backgroundColor: "#4fc3f7",
            padding: "10px",
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          Cabeçalho da Página
        </header>

        {/* Conteúdo Central */}
        <section style={{ padding: "20px", textAlign: "center" }}>
          <h1>Bem-vindo à Página Inicial</h1>
          <p>
            Aqui está uma página básica com barra lateral, cabeçalho e rodapé.
          </p>
        </section>

        {/* Rodapé */}
        <footer
          style={{
            backgroundColor: "#4fc3f7",
            padding: "10px",
            textAlign: "center",
            marginTop: "auto",
          }}
        >
          Rodapé da Página
        </footer>
      </main>
    </div>
  );
}

export default Home;
