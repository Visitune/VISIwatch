export default async function handler(request, response) {
  // 1. Récupérer l'URL cible depuis les paramètres
  const { url } = request.query;

  if (!url) {
    return response.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // 2. Le serveur Vercel fait la requête vers le site externe (ANSES, EFSA, etc.)
    // On ajoute un User-Agent pour ne pas être bloqué par les pare-feux qui rejettent les bots
    const fetchResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VISIwatch-Bot/1.0; +https://visiwatch.vercel.app)',
      },
    });

    if (!fetchResponse.ok) {
      throw new Error(`Erreur distante: ${fetchResponse.status} ${fetchResponse.statusText}`);
    }

    const data = await fetchResponse.text();
    const contentType = fetchResponse.headers.get('content-type');

    // 3. Configurer les entêtes CORS pour autoriser ton application React à lire la réponse
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*'); // Autorise tout le monde (ou mettre ton domaine spécifique)
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Si c'est du XML (RSS), on s'assure que le header est bon
    if (contentType) {
      response.setHeader('Content-Type', contentType);
    }

    // 4. Renvoyer les données au Frontend
    response.status(200).send(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    response.status(500).json({ error: 'Erreur lors de la récupération du flux', details: error.message });
  }
}