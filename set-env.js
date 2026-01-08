const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

console.log('🔧 Generando archivos de configuración de entorno...\n');

// Cargar variables del .env SIN inyectar en process.env
const envPath = path.resolve(__dirname, '.env');
const envConfig = dotenv.config({ path: envPath, processEnv: {} });

if (envConfig.error) {
  console.error('❌ Error al cargar .env:', envConfig.error);
  process.exit(1);
}

// Función para convertir SNAKE_CASE a camelCase
// Ejemplo: BACKEND_URL -> backendUrl, API_KEY -> apiKey
function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Convertir todas las variables del .env a un objeto con camelCase
const envVars = {};
Object.keys(envConfig.parsed || {}).forEach(key => {
  const camelKey = toCamelCase(key);
  let value = envConfig.parsed[key];

  // Convertir strings "true"/"false" a booleanos
  if (value === 'true') value = true;
  else if (value === 'false') value = false;
  // Si es un número, convertirlo
  else if (!isNaN(value) && value !== '') value = Number(value);

  envVars[camelKey] = value;
});

// Generar el contenido del archivo environment dinámicamente
const generateEnvFile = (isProd = false) => {
  const envObj = { ...envVars };
  if (isProd !== undefined) envObj.production = isProd;

  const entries = Object.entries(envObj)
    .map(([key, value]) => {
      const formattedValue = typeof value === 'string' ? `'${value}'` : value;
      return `  ${key}: ${formattedValue}`;
    })
    .join(',\n');

  return `// Este archivo es generado automáticamente por set-env.js
// NO EDITAR MANUALMENTE - Los cambios se perderán

export const environment = {
${entries}
};
`;
};

// Escribir archivos
const developmentPath = './src/environments/environment.development.ts';
const productionPath = './src/environments/environment.ts';

// Archivo de desarrollo (production = false)
const devContent = generateEnvFile(false);
fs.writeFileSync(developmentPath, devContent);
console.log(`✅ ${developmentPath}`);

// Archivo de producción (production = true)
const prodContent = generateEnvFile(true);
fs.writeFileSync(productionPath, prodContent);
console.log(`✅ ${productionPath}`);

console.log(`\n📦 Variables cargadas:`);
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`   - ${key}: ${value}`);
});

console.log(`\n🎉 Archivos generados exitosamente - ${new Date().toLocaleString()}`);
