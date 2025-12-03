// Données simulées pour ARDHI_CHAIN
// Coordonnées approximatives centrées sur Goma, RDC

export const mockProperties = [
    { 
        id: 'nft-001', 
        type: 'Vente', 
        category: 'Parcelle', 
        name: 'Terrain titré, Secteur Katindo', 
        location: 'Katindo', 
        price: '5,000 ADA', 
        surface: '350m²', 
        description: "Grande parcelle titrée, idéale pour construction résidentielle ou commerce. Titres sécurisés. Le titre NFT offre une sécurité maximale contre les litiges fonciers et assure la traçabilité de l'historique de propriété.", 
        geo: { lat: -1.6781, lng: 29.2345 }, // Coordonnées Katindo
        image: '/images/house1.jpg' 
    },
    { 
        id: 'nft-002', 
        type: 'Location', 
        category: 'Maison', 
        name: 'Maison 4 ch. tout confort', 
        location: 'Himbi', 
        price: '200 USD/Mois', 
        surface: '200m²', 
        description: "Belle maison moderne de 4 chambres, sécurisée, avec électricité stable et eau courante. Le contrat de location est enregistré comme un token pour garantir les termes de l'accord.", 
        geo: { lat: -1.6850, lng: 29.2450 }, // Coordonnées Himbi
        image: '/images/house2.jpg'
    },
    { 
        id: 'nft-003', 
        type: 'Vente', 
        category: 'Maison', 
        name: 'Villa de luxe 5 ch., Goma', 
        location: 'Lac Vert', 
        price: '45,000 ADA', 
        surface: '500m²', 
        description: "Villa exceptionnelle avec vue sur le lac, finitions haut de gamme, titres vérifiés. Une opportunité d'investissement unique avec des titres garantis par la blockchain Cardano.", 
        geo: { lat: -1.6912, lng: 29.2550 }, // Coordonnées Lac Vert
        image: '/images/house3.jpg'
    },
    { 
        id: 'nft-004', 
        type: 'Vente', 
        category: 'Parcelle', 
        name: 'Parcelle stratégique, Ndosho', 
        location: 'Ndosho', 
        price: '8,000 ADA', 
        surface: '400m²', 
        description: "Parcelle d'angle bien située pour investissement commercial. Zone à forte croissance. Titre foncier instantanément transférable via le NFT associé.", 
        geo: { lat: -1.6600, lng: 29.2000 }, // Coordonnées Ndosho
        image: '/images/house4.jpg'
    }
];

// Coordonnées centrales de Goma
export const GOMA_CENTER = { lat: -1.68, lng: 29.23 };