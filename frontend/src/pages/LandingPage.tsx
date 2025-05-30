import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Shield,
  CheckCircle,
  Search,
  Clock,
  Calendar as CalendarIcon,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

type FAQItem = {
  question: string;
  answer: string;
  isOpen: boolean;
};

const LandingPage = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: "Comment prendre rendez-vous avec un médecin ?",
      answer: "Il suffit de créer un compte, rechercher un médecin selon votre besoin, consulter ses disponibilités et choisir un créneau qui vous convient. La confirmation est instantanée.",
      isOpen: false
    },
    {
      question: "Comment puis-je annuler ou modifier mon rendez-vous ?",
      answer: "Connectez-vous à votre compte, accédez à la section 'Mes Rendez-vous', sélectionnez le rendez-vous concerné et cliquez sur 'Modifier' ou 'Annuler'. Notez que certains médecins peuvent avoir des politiques spécifiques concernant les annulations.",
      isOpen: false
    },
    {
      question: "Comment s'inscrire en tant que médecin ?",
      answer: "Rendez-vous sur la page d'inscription, sélectionnez 'Je suis médecin', complétez le formulaire avec vos informations professionnelles et votre numéro d'ordre des médecins. Notre équipe vérifiera vos informations avant validation.",
      isOpen: false
    },
    {
      question: "Est-ce que mes données médicales sont sécurisées ?",
      answer: "Absolument. Nous utilisons des protocoles de sécurité avancés pour protéger vos données personnelles et médicales. Toutes les informations sont cryptées et ne sont accessibles qu'aux professionnels de santé concernés.",
      isOpen: false
    },
    {
      question: "Le service est-il gratuit pour les patients ?",
      answer: "Oui, la prise de rendez-vous sur notre plateforme est totalement gratuite pour les patients. Vous ne payez que la consultation auprès du médecin, selon ses tarifs habituels.",
      isOpen: false
    }
  ]);

  const toggleFaq = (index: number) => {
    setFaqs(faqs.map((faq, i) => ({
      ...faq,
      isOpen: i === index ? !faq.isOpen : faq.isOpen
    })));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 animate-fade-in">
              <h1 className="h1 text-primary">
                Trouvez un médecin près de chez vous en quelques clics
              </h1>
              <p className="lead max-w-xl">
                MediRDV simplifie la prise de rendez-vous médicaux en Tunisie. 
                Consultez les disponibilités des médecins et réservez votre créneau instantanément.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link to="/signup">Commencer</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Déjà membre ?</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end animate-slide-up">
              <img 
                src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Medical Consultation" 
                className="rounded-xl shadow-lg w-full max-w-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="h2 mb-4">Une expérience simplifiée</h2>
            <p className="lead max-w-2xl mx-auto">
              Découvrez les fonctionnalités qui rendent MediRDV indispensable pour vos rendez-vous médicaux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center animate-slide-up">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recherche intuitive</h3>
              <p className="text-muted-foreground">
                Trouvez rapidement le médecin idéal par spécialité, localité ou nom.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Disponibilités en temps réel</h3>
              <p className="text-muted-foreground">
                Consultez les créneaux disponibles et réservez instantanément.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestion des rendez-vous</h3>
              <p className="text-muted-foreground">
                Consultez, modifiez ou annulez vos rendez-vous en quelques clics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurité maximale</h3>
              <p className="text-muted-foreground">
                Vos données personnelles et médicales sont protégées par des systèmes sécurisés.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rappels automatiques</h3>
              <p className="text-muted-foreground">
                Recevez des notifications pour ne jamais manquer un rendez-vous.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Médecins certifiés</h3>
              <p className="text-muted-foreground">
                Tous nos médecins sont vérifiés pour garantir un service de qualité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="h2 mb-4">Ce que disent nos utilisateurs</h2>
            <p className="lead max-w-2xl mx-auto">
              Des milliers de patients et médecins font confiance à MediRDV pour leurs rendez-vous médicaux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "Grâce à MediRDV, je peux gérer mon emploi du temps médical plus efficacement. Mes patients apprécient la facilité de prise de rendez-vous."
              </p>
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="font-medium">Dr. Asma Belhadj</p>
                  <p className="text-sm text-muted-foreground">Cardiologue, Tunis</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "J'ai pu trouver un spécialiste disponible dans ma région en quelques minutes. Simple et efficace, exactement ce dont j'avais besoin !"
              </p>
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="font-medium">Mohamed Karim</p>
                  <p className="text-sm text-muted-foreground">Patient, Sousse</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "En tant que nouveau cabinet, MediRDV nous a permis d'augmenter notre visibilité et de simplifier la gestion des rendez-vous. Un gain de temps précieux !"
              </p>
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="font-medium">Dr. Nabil Mansour</p>
                  <p className="text-sm text-muted-foreground">Dermatologue, Sfax</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24" id="faq">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="h2 mb-4">Questions fréquentes</h2>
            <p className="lead max-w-2xl mx-auto">
              Vous avez des questions ? Nous avons les réponses.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border-b py-4 last:border-b-0"
              >
                <button 
                  className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={faq.isOpen}
                >
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  {faq.isOpen ? (
                    <ChevronUp className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div 
                  className={cn(
                    "mt-2 text-muted-foreground transition-all duration-300 overflow-hidden",
                    faq.isOpen ? "max-h-96" : "max-h-0"
                  )}
                >
                  <p className="pb-4">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à simplifier vos rendez-vous médicaux ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à MediRDV pour leurs besoins médicaux.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-primary font-medium"
            asChild
          >
            <Link to="/signup">Créer un compte gratuitement</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;