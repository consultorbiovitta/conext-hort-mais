// Vercel Serverless Function: lê a planilha publicada (CSV) no servidor e entrega para a página.
// Evita bloqueios de navegador (CORS). Salve como: api/produtos.js
const SHEET_CSV_URL =
  process.env.SHEET_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDuXXYAw3yaajmEoDkior1NHcxCOGUTazQpfGa-KvI6PBytTvUv5ZMKCGDyHVNdni7gckhGubF1g2H/pub?gid=1067313681&single=true&output=csv";

module.exports = async function handler(req, res) {
  try {
    const r = await fetch(SHEET_CSV_URL + "&_=" + Date.now());
    if (!r.ok) return res.status(502).send("Planilha indisponível (HTTP " + r.status + ")");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).send(await r.text());
  } catch (e) {
    return res.status(502).send("Planilha indisponível");
  }
};
