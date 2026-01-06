async function init() {
  try {
    const parser = new DOMParser();
    const xsltProcessor = new XSLTProcessor();
    
    // Chargement du fichier XSLT
    const xslResponse = await fetch("Meteo.xsl");
    if (!xslResponse.ok) {
      throw new Error(`Erreur XSLT: ${xslResponse.status}`);
    }
    const xslText = await xslResponse.text();
    const xslStylesheet = parser.parseFromString(xslText, "application/xml");
    
    // Vérifier les erreurs de parsing XSLT
    if (xslStylesheet.querySelector("parsererror")) {
      throw new Error("Erreur de parsing du fichier XSLT");
    }
    
    xsltProcessor.importStylesheet(xslStylesheet);
    
    // Chargement des données météo
    const xmlResponse = await fetch("https://www.infoclimat.fr/public-api/gfs/xml?_ll=48.67103,6.15083&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2");
    
    if (!xmlResponse.ok) {
      throw new Error(`Erreur API météo: ${xmlResponse.status}`);
    }
    
    const xmlText = await xmlResponse.text();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    
    // Vérifier les erreurs de parsing XML
    if (xmlDoc.querySelector("parsererror")) {
      throw new Error("Erreur de parsing des données météo");
    }
    
    console.log("XML chargé:", xmlDoc);
    
    // Transformation XSLT
    const fragment = xsltProcessor.transformToFragment(xmlDoc, document);
    
    if (fragment) {
      document.getElementById("result").appendChild(fragment);
      console.log("Transformation réussie");
    } else {
      throw new Error("La transformation XSLT a échoué");
    }
    
  } catch (error) {
    console.error("Erreur:", error);
    document.getElementById("result").innerHTML = 
      `<p style="color: red;">Erreur lors du chargement des données météo: ${error.message}</p>`;
  }
}

// Attendre que le DOM soit chargé
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}