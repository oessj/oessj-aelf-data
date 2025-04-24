const fs = require('fs');
const path = require('path');
const https = require('https');

// Fonction pour récupérer les données de l'API AELF
function fetchAelfData(endpoint, date) {
  return new Promise((resolve, reject) => {
    const url = `https://api.aelf.org/v1/${endpoint}/${date}/france`;
    console.log(`Fetching ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Failed to fetch ${url}: ${err.message}`));
    });
  });
}

// Fonction pour simplifier les données et ne garder que ce dont on a besoin
function simplifyData(data, type) {
  // Selon le type d'office, on simplifie différemment
  switch (type) {
    case 'laudes':
      if (!data.laudes) return null;
      return {
        date: data.date,
        laudes: {
          introduction: data.laudes.introduction || '',
          hymne: data.laudes.hymne || '',
          antienne_psaume1: data.laudes.antienne_psaume1 || '',
          psaume1: data.laudes.psaume1 || {},
          antienne_psaume2: data.laudes.antienne_psaume2 || '',
          psaume2: data.laudes.psaume2 || {},
          antienne_psaume3: data.laudes.antienne_psaume3 || '',
          psaume3: data.laudes.psaume3 || {},
          pericope: data.laudes.pericope || {},
          repons: data.laudes.repons || '',
          antienne_zacharie: data.laudes.antienne_zacharie || '',
          cantique_zacharie: data.laudes.cantique_zacharie || {},
          intercession: data.laudes.intercession || '',
          notre_pere: data.laudes.notre_pere || '',
          oraison: data.laudes.oraison || ''
        }
      };
    case 'complies':
      if (!data.complies) return null;
      return {
        date: data.date,
        complies: {
          introduction: data.complies.introduction || '',
          hymne: data.complies.hymne || '',
          antienne_psaume1: data.complies.antienne_psaume1 || '',
          psaume1: data.complies.psaume1 || {},
          antienne_psaume2: data.complies.antienne_psaume2 || '',
          psaume2: data.complies.psaume2 || {},
          pericope: data.complies.pericope || {},
          repons: data.complies.repons || '',
          antienne_symeon: data.complies.antienne_symeon || '',
          cantique_symeon: data.complies.cantique_symeon || {},
          oraison: data.complies.oraison || '',
          benediction: data.complies.benediction || ''
        }
      };
    case 'vepres':
      if (!data.vepres) return null;
      return {
        date: data.date,
        vepres: {
          introduction: data.vepres.introduction || '',
          hymne: data.vepres.hymne || '',
          antienne_psaume1: data.vepres.antienne_psaume1 || '',
          psaume1: data.vepres.psaume1 || {},
          antienne_psaume2: data.vepres.antienne_psaume2 || '',
          psaume2: data.vepres.psaume2 || {},
          antienne_psaume3: data.vepres.antienne_psaume3 || '',
          psaume3: data.vepres.psaume3 || {},
          pericope: data.vepres.pericope || {},
          repons: data.vepres.repons || '',
          antienne_magnificat: data.vepres.antienne_magnificat || '',
          cantique_magnificat: data.vepres.cantique_magnificat || {},
          intercession: data.vepres.intercession || '',
          notre_pere: data.vepres.notre_pere || '',
          oraison: data.vepres.oraison || ''
        }
      };
    case 'messe':
      if (!data.messes) return null;
      return {
        date: data.date,
        messe: {
          premiere_lecture: data.messes[0]?.lectures?.premiere_lecture || {},
          psaume: data.messes[0]?.lectures?.psaume || {},
          deuxieme_lecture: data.messes[0]?.lectures?.deuxieme_lecture || {},
          evangile: data.messes[0]?.lectures?.evangile || {}
        }
      };
    case 'tierce':
      if (!data.tierce) return null;
      return {
        date: data.date,
        tierce: {
          introduction: data.tierce.introduction || '',
          hymne: data.tierce.hymne || '',
          antienne_psaume1: data.tierce.antienne_psaume1 || '',
          psaume1: data.tierce.psaume1 || {},
          antienne_psaume2: data.tierce.antienne_psaume2 || '',
          psaume2: data.tierce.psaume2 || {},
          antienne_psaume3: data.tierce.antienne_psaume3 || '',
          psaume3: data.tierce.psaume3 || {},
          pericope: data.tierce.pericope || {},
          repons: data.tierce.repons || '',
          oraison: data.tierce.oraison || ''
        }
      };
    case 'sexte':
      if (!data.sexte) return null;
      return {
        date: data.date,
        sexte: {
          introduction: data.sexte.introduction || '',
          hymne: data.sexte.hymne || '',
          antienne_psaume1: data.sexte.antienne_psaume1 || '',
          psaume1: data.sexte.psaume1 || {},
          antienne_psaume2: data.sexte.antienne_psaume2 || '',
          psaume2: data.sexte.psaume2 || {},
          antienne_psaume3: data.sexte.antienne_psaume3 || '',
          psaume3: data.sexte.psaume3 || {},
          pericope: data.sexte.pericope || {},
          repons: data.sexte.repons || '',
          oraison: data.sexte.oraison || ''
        }
      };
    case 'none':
      if (!data.none) return null;
      return {
        date: data.date,
        none: {
          introduction: data.none.introduction || '',
          hymne: data.none.hymne || '',
          antienne_psaume1: data.none.antienne_psaume1 || '',
          psaume1: data.none.psaume1 || {},
          antienne_psaume2: data.none.antienne_psaume2 || '',
          psaume2: data.none.psaume2 || {},
          antienne_psaume3: data.none.antienne_psaume3 || '',
          psaume3: data.none.psaume3 || {},
          pericope: data.none.pericope || {},
          repons: data.none.repons || '',
          oraison: data.none.oraison || ''
        }
      };
    case 'lectures':
      if (!data.lectures) return null;
      return {
        date: data.date,
        lectures: {
          introduction: data.lectures.introduction || '',
          hymne: data.lectures.hymne || '',
          antienne_psaume1: data.lectures.antienne_psaume1 || '',
          psaume1: data.lectures.psaume1 || {},
          antienne_psaume2: data.lectures.antienne_psaume2 || '',
          psaume2: data.lectures.psaume2 || {},
          antienne_psaume3: data.lectures.antienne_psaume3 || '',
          psaume3: data.lectures.psaume3 || {},
          verset: data.lectures.verset || '',
          premiere_lecture: data.lectures.premiere_lecture || {},
          repons1: data.lectures.repons1 || '',
          deuxieme_lecture: data.lectures.deuxieme_lecture || {},
          repons2: data.lectures.repons2 || '',
          te_deum: data.lectures.te_deum || '',
          oraison: data.lectures.oraison || ''
        }
      };
    default:
      return data;
  }
}

// Fonction principale pour récupérer et sauvegarder les données
async function main() {
  try {
    // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Liste des offices à récupérer
    const offices = ['laudes', 'complies', 'vepres', 'messe', 'tierce', 'sexte', 'none', 'lectures'];
    
    // Créer les répertoires s'ils n'existent pas
    for (const office of offices) {
      const dir = path.join(__dirname, '..', 'data', office);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    
    // Pour chaque office, récupérer et sauvegarder les données
    for (const office of offices) {
      try {
        const data = await fetchAelfData(office, today);
        const simplified = simplifyData(data, office);
        
        if (simplified) {
          // Sauvegarder les données dans un fichier JSON
          const filePath = path.join(__dirname, '..', 'data', office, `${today}.json`);
          fs.writeFileSync(filePath, JSON.stringify(simplified, null, 2));
          console.log(`Saved ${office} data to ${filePath}`);
          
          // Sauvegarder également dans un fichier "latest.json"
          const latestPath = path.join(__dirname, '..', 'data', office, 'latest.json');
          fs.writeFileSync(latestPath, JSON.stringify(simplified, null, 2));
          console.log(`Updated ${office} latest data in ${latestPath}`);
        } else {
          console.log(`No data available for ${office} on ${today}`);
        }
      } catch (err) {
        console.error(`Error processing ${office}:`, err);
      }
    }
    
    // Créer un fichier index.json qui liste tous les offices disponibles
    const index = {
      updated: new Date().toISOString(),
      offices: offices.map(office => ({
        name: office,
        latest: `data/${office}/latest.json`,
        today: `data/${office}/${today}.json`
      }))
    };
    
    fs.writeFileSync(path.join(__dirname, '..', 'index.json'), JSON.stringify(index, null, 2));
    console.log('Updated index.json');
    
  } catch (err) {
    console.error('Error in main process:', err);
    process.exit(1);
  }
}

// Exécuter la fonction principale
main();
