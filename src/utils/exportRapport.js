import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/Logo coref.png";

export const exportRapportPDF = (data) => {

  const formatMontant = (montant) => {
  return Number(montant || 0)
    .toLocaleString("fr-FR")
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ");
};

const verifierSautPage = (hauteurNecessaire = 40) => {
  const hauteurPage = doc.internal.pageSize.getHeight();

  if (currentY + hauteurNecessaire > hauteurPage - 20) {
    doc.addPage();
    currentY = 20;
  }
};

  const doc = new jsPDF("p", "mm", "a4");

  doc.addImage(logo, "PNG", 15, 10, 30, 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text("COREF FROID", 105, 20, {
    align: "center",
  });

  doc.setFontSize(16);

  doc.text("RAPPORT JOURNALIER", 105, 30, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Date : ${new Date().toLocaleDateString()}`,
    15,
    48
  );

  doc.text(
    `Heure : ${new Date().toLocaleTimeString()}`,
    150,
    48
  );

  // ======================
// RESUME FINANCIER
// ======================

doc.setFontSize(14);
doc.setFont("helvetica", "bold");

doc.text("Résumé financier", 15, 60);

autoTable(doc, {
  startY: 65,

  head: [["Rubrique", "Montant (FC)"]],

  body: [
    [
      "Ventes comptant",
      `${formatMontant(data.totalComptant) } FC`,
    ],

    [
      "Acomptes ventes crédit",
      `${formatMontant(data.totalAcomptes)} FC`,
    ],

    [
      "Paiements des dettes",
      `${formatMontant(data.totalPaiementDette)} FC`,
    ],

    [
      "Total encaissé",
      `${formatMontant(data.totalEncaisse)} FC`,
    ],

    [
      "Dépenses",
      `${formatMontant(data.totalDepenses)} FC`,
    ],

    [
      "Total à verser",
      `${formatMontant(data.totalAVerser)} FC`,
    ],
  ],

  theme: "grid",

  headStyles: {
    fillColor: [0, 102, 204],
    textColor: 255,
    halign: "center",
  },

  styles: {
    fontSize: 11,
    cellPadding: 3,
  },

  columnStyles: {
    0: {
      cellWidth: 100,
    },

    1: {
      halign: "right",
    },
  },
});

// Position après le résumé
let currentY = doc.lastAutoTable.finalY + 15;

// =========================
// VENTES COMPTANT
// =========================
verifierSautPage(90);

doc.setFont("helvetica", "bold");
doc.setFontSize(14);

doc.text("VENTES COMPTANT", 15, currentY);

const produitsComptant = {};

data.ventesComptant.forEach((vente) => {

  vente.lignes.forEach((ligne) => {

    const nom = ligne.produit.nom;

    if (!produitsComptant[nom]) {

      produitsComptant[nom] = {
        nom,
        quantite: 0,
        prixUnitaire: Number(ligne.prixUnitaire),
      };

    }

    produitsComptant[nom].quantite += Number(ligne.quantite);

  });

});

const ventesComptantRegroupees = Object.values(produitsComptant);

autoTable(doc, {
  startY: currentY + 5,

  head: [["Produit", "Quantité", "Prix unitaire", "Montant"]],

  body: ventesComptantRegroupees.map((produit) => [

  produit.nom,

  produit.quantite,

  `${formatMontant(produit.prixUnitaire)} FC`,

  `${formatMontant(
    produit.quantite * produit.prixUnitaire
  )} FC`

]),

  theme: "grid",

  tableLineColor: [0, 0, 0],
  tableLineWidth: 0.4,

  headStyles: {
  fillColor: [0, 102, 204],
  textColor: 255,

  lineColor: [0, 0, 0],
  lineWidth: 0.4,

  halign: "center",
},

  styles: {
  fontSize: 10,
  cellPadding: 3,

  lineColor: [0, 0, 0],
  lineWidth: 0.2,

  valign: "middle",
},

bodyStyles: {
  lineColor: [0, 0, 0],
  lineWidth: 0.2,
},

  columnStyles: {

  0: {
    cellWidth: 70,
  },

  1: {
    cellWidth: 25,
    halign: "center",
  },

  2: {
    cellWidth: 45,
    halign: "right",
  },

  3: {
    cellWidth: 45,
    halign: "right",
  },

},
});

currentY = doc.lastAutoTable.finalY + 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(11);

doc.text(
  `TOTAL VENTES COMPTANT : ${formatMontant(
    data.totalComptant
  )} FC`,
  130,
  currentY
);

// Position après le tableau des ventes comptant
currentY = doc.lastAutoTable.finalY + 15;

// =========================
// VENTES A CREDIT
// =========================
verifierSautPage(90);

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("VENTES A CREDIT", 15, currentY);

autoTable(doc, {
  startY: currentY + 5,

  head: [[
    "Client",
    "Produit",
    "Qté",
    "Montant",
    "Acompte"
  ]],

  body: data.ventesCredit.map((vente) => [

  vente.client?.prenom || "Client inconnu",

  vente.lignes
    .map(
      (ligne) =>
        `${ligne.produit.nom} x ${ligne.quantite}`
    )
    .join("\n"),

  vente.lignes.reduce(
    (sum, ligne) =>
      sum + Number(ligne.quantite),
    0
  ),

  `${formatMontant(vente.montant)} FC`,

  `${formatMontant(vente.acompte)} FC`,
]),

  theme: "grid",

  tableLineColor: [0, 0, 0],
  tableLineWidth: 0.4,

  styles: {
    fontSize: 10,
    cellPadding: 3,
    lineColor: [0, 0, 0],
    lineWidth: 0.2,
    valign: "middle",
  },

  headStyles: {
    fillColor: [10, 100, 204], 
    textColor: 255,
    halign: "center",
    lineColor: [0, 0, 0],
    lineWidth: 0.4,
  },

  bodyStyles: {
    lineColor: [0, 0, 0],
    lineWidth: 0.2,
  },

  columnStyles: {

  0: {
    cellWidth: 35,
  },

  1: {
    cellWidth: 70,
  },

  2: {
    cellWidth: 20,
    halign: "center",
  },

  3: {
    cellWidth: 30,
    halign: "right",
  },

  4: {
    cellWidth: 30,
    halign: "right",
  },

},
});
currentY = doc.lastAutoTable.finalY + 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(11);

doc.text(
  `TOTAL VENTES ACOMPTE : ${formatMontant(
    data.totalAcomptes
  )} FC`,
  130,
  currentY
);

// Position après le tableau des ventes acompte
currentY = doc.lastAutoTable.finalY + 15;

// Position après le tableau des ventes à crédit
currentY = doc.lastAutoTable.finalY + 15;

// =========================
// PAIEMENTS DES DETTES
// =========================
verifierSautPage(80);

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("PAIEMENTS DES DETTES", 15, currentY);

autoTable(doc, {
  startY: currentY + 5,

  head: [[
    "Client",
    "Montant payé",
    "Date"
  ]],

  body: data.paiements.map((paiement) => [

    paiement.client,

    `${formatMontant(paiement.montant)} FC`,

    new Date(
      paiement.createdAt
    ).toLocaleDateString(),

  ]),

  theme: "grid",

  tableLineColor: [0, 0, 0],
  tableLineWidth: 0.4,

  styles: {
    fontSize: 10,
    cellPadding: 3,
    lineColor: [0, 0, 0],
    lineWidth: 0.2,
    valign: "middle",
  },

  headStyles: {
    fillColor: [40, 167, 69], // Vert
    textColor: 255,
    halign: "center",
    lineColor: [0, 0, 0],
    lineWidth: 0.4,
  },

  bodyStyles: {
    lineColor: [0, 0, 0],
    lineWidth: 0.2,
  },

  columnStyles: {

    0: {
      cellWidth: 70,
    },

    1: {
      cellWidth: 50,
      halign: "right",
    },

    2: {
      cellWidth: 45,
      halign: "center",
    },

  },

});

currentY = doc.lastAutoTable.finalY + 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(11);

doc.text(
  `TOTAL DES PAIEMENTS : ${formatMontant(
    data.totalPaiementDette
  )} FC`,
  110,
  currentY
);

// Position après le tableau des paiements
currentY = doc.lastAutoTable.finalY + 15;

// =========================
// DEPENSES
// =========================
verifierSautPage(80);

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("DEPENSES", 15, currentY);

autoTable(doc, {

  startY: currentY + 5,

  head: [[
    "Libellé",
    "Montant",
    "Date"
  ]],

  body: data.depenses.map((depense) => [

    depense.libelle,

    `${formatMontant(depense.montant)} FC`,

    new Date(
      depense.createdAt
    ).toLocaleDateString(),

  ]),

  theme: "grid",

  tableLineColor: [0,0,0],
  tableLineWidth: 0.4,

  styles:{
    fontSize:10,
    cellPadding:3,

    lineColor:[0,0,0],
    lineWidth:0.2,

    valign:"middle",
  },

  headStyles:{
    fillColor:[255,140,0], // orange
    textColor:255,

    halign:"center",

    lineColor:[0,0,0],
    lineWidth:0.4,
  },

  bodyStyles:{
    lineColor:[0,0,0],
    lineWidth:0.2,
  },

  columnStyles:{

    0:{
      cellWidth:80,
    },

    1:{
      cellWidth:45,
      halign:"right",
    },

    2:{
      cellWidth:40,
      halign:"center",
    },

  },

});

currentY = doc.lastAutoTable.finalY + 8;

doc.setFont("helvetica","bold");
doc.setFontSize(11);

doc.text(

`TOTAL DEPENSES : ${formatMontant(data.totalDepenses)} FC`,

110,

currentY

);

currentY = doc.lastAutoTable.finalY + 15;

verifierSautPage(80);

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("APPROVISIONNEMENTS", 15, currentY);

autoTable(doc, {
  startY: currentY + 5,

  head: [[
    "Produit",
    "Quantité",
    "Date"
  ]],

  body: data.approvisionnements.map(app => [

    app.produit.nom,

    app.quantite,

    new Date(app.createdAt).toLocaleDateString(),

  ]),

  theme: "grid",

  tableLineColor: [0,0,0],
  tableLineWidth:0.4,

  styles:{
    fontSize:10,
    cellPadding:3,

    lineColor:[0,0,0],
    lineWidth:0.2,
  },

  headStyles:{
    fillColor:[52,73,94],
    textColor:255,
    halign:"center"
  },

  columnStyles:{
    0:{cellWidth:80},
    1:{cellWidth:40,halign:"center"},
    2:{cellWidth:40,halign:"center"}
  }

});

const pageCount = doc.getNumberOfPages();

for(let i=1;i<=pageCount;i++){

doc.setPage(i);

doc.setFontSize(9);

doc.setTextColor(120);

doc.text(

`COREf FROID - Rapport généré le ${new Date().toLocaleDateString()}`,

15,

290

);

doc.text(

`Page ${i} / ${pageCount}`,

180,

290,

{
align:"right"
}

);

}

  doc.save("rapport.pdf");


};