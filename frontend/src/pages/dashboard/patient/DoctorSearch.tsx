import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, UserRound } from 'lucide-react';

// Mock data for doctors
const doctors = [
  {
    id: '1',
    name: 'Dr. Asma Belhadj',
    specialty: 'Cardiologie',
    address: '15 Rue de Carthage, Tunis',
    city: 'Tunis',
    rating: 4.8,
    reviewCount: 127,
    availableToday: true,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Dr. Mohamed Karim',
    specialty: 'Médecine générale',
    address: '8 Avenue Habib Bourguiba, Sousse',
    city: 'Sousse',
    rating: 4.6,
    reviewCount: 85,
    availableToday: false,
    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'Dr. Fatma Haddad',
    specialty: 'Dermatologie',
    address: '22 Rue Ibn Khaldoun, Tunis',
    city: 'Tunis',
    rating: 4.9,
    reviewCount: 156,
    availableToday: true,
    image: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    name: 'Dr. Ahmed Ben Salah',
    specialty: 'Ophtalmologie',
    address: '45 Avenue 14 Janvier, Sfax',
    city: 'Sfax',
    rating: 4.7,
    reviewCount: 92,
    availableToday: true,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '5',
    name: 'Dr. Nadia Mansour',
    specialty: 'Pédiatrie',
    address: '3 Rue de France, Monastir',
    city: 'Monastir',
    rating: 4.9,
    reviewCount: 178,
    availableToday: false,
    image: 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '6',
    name: 'Dr. Sami Mejri',
    specialty: 'Cardiologie',
    address: '18 Rue Alain Savary, Tunis',
    city: 'Tunis',
    rating: 4.5,
    reviewCount: 73,
    availableToday: true,
    image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const specialties = [
  "Toutes les spécialités",
  "Médecine générale",
  "Cardiologie",
  "Dermatologie",
  "Ophtalmologie",
  "Pédiatrie",
  "Gynécologie",
  "Psychiatrie",
  "ORL",
  "Urologie",
];

const cities = [
  "Toutes les villes",
  "Tunis",
  "Sfax",
  "Sousse",
  "Monastir",
  "Kairouan",
  "Bizerte",
  "Gabès",
  "Ariana",
  "Ben Arous",
];

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Toutes les spécialités');
  const [selectedCity, setSelectedCity] = useState('Toutes les villes');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Filter doctors based on search criteria
  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by search term (name)
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by specialty
    const matchesSpecialty = selectedSpecialty === 'Toutes les spécialités' || doctor.specialty === selectedSpecialty;
    
    // Filter by city
    const matchesCity = selectedCity === 'Toutes les villes' || doctor.city === selectedCity;
    
    // Filter by availability
    const matchesAvailability = !availableOnly || doctor.availableToday;
    
    return matchesSearch && matchesSpecialty && matchesCity && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Rechercher un médecin</h1>
      
      {/* Search Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Nom du médecin
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="specialty" className="text-sm font-medium">
                Spécialité
              </label>
              <Select
                value={selectedSpecialty}
                onValueChange={setSelectedSpecialty}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                Ville
              </label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className={`w-full ${availableOnly ? 'bg-primary/10 border-primary' : ''}`}
                onClick={() => setAvailableOnly(!availableOnly)}
              >
                {availableOnly ? 'Disponible aujourd\'hui ✓' : 'Disponible aujourd\'hui'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {filteredDoctors.length} médecin{filteredDoctors.length !== 1 ? 's' : ''} trouvé{filteredDoctors.length !== 1 ? 's' : ''}
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 w-full">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover" 
                />
                {doctor.availableToday && (
                  <span className="absolute top-2 right-2 bg-success/90 text-white px-2 py-1 rounded-md text-xs">
                    Disponible aujourd'hui
                  </span>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <UserRound className="h-4 w-4 mr-1" />
                    {doctor.specialty}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {doctor.city}
                  </p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? "fill-current" : "stroke-current fill-none"}`}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-muted-foreground">
                      {doctor.rating} ({doctor.reviewCount} avis)
                    </span>
                  </div>
                  <Button className="w-full mt-2" asChild>
                    <Link to={`/dashboard/patient/doctor/${doctor.id}`}>
                      Voir le profil
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredDoctors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">Aucun médecin ne correspond à vos critères de recherche.</p>
            <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;