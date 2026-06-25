import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <Link href="/register" className="legal-page__back-arrow">&#8592; Retour</Link>

        <h1 className="legal-page__title">Politique de confidentialite</h1>
        <p className="legal-page__date">Derniere mise a jour : juin 2025</p>

        <section className="legal-section">
          <h2>1. Donnees collectees</h2>
          <p>Nous collectons les donnees suivantes lors de l'utilisation de Breezy :</p>
          <ul>
            <li>Informations de compte : nom d'utilisateur et mot de passe (hache)</li>
            <li>Contenu publie : posts, commentaires et interactions</li>
            <li>Donnees de navigation : adresse IP, type de navigateur, pages visitees</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. Utilisation des donnees</h2>
          <p>Vos donnees sont utilisees pour :</p>
          <ul>
            <li>Fournir et ameliorer le service</li>
            <li>Assurer la securite de la plateforme</li>
            <li>Moderer les contenus inappropries</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Cookies</h2>
          <p>Breezy utilise un cookie d'authentification <strong>HttpOnly</strong> pour maintenir votre session. Ce cookie n'est pas accessible par des scripts tiers et expire apres 7 jours. Il ne contient aucune information personnelle en dehors d'un identifiant de session chiffre.</p>
        </section>

        <section className="legal-section">
          <h2>4. Partage des donnees</h2>
          <p>Nous ne vendons ni ne partageons vos donnees personnelles avec des tiers a des fins commerciales. Vos donnees peuvent etre divulguees uniquement si la loi l'exige.</p>
        </section>

        <section className="legal-section">
          <h2>5. Conservation des donnees</h2>
          <p>Vos donnees sont conservees tant que votre compte est actif. Vous pouvez demander la suppression de votre compte et de vos donnees a tout moment.</p>
        </section>

        <section className="legal-section">
          <h2>6. Vos droits</h2>
          <p>Conformement au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'acces a vos donnees personnelles</li>
            <li>Droit de rectification</li>
            <li>Droit a l'effacement ("droit a l'oubli")</li>
            <li>Droit a la portabilite des donnees</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Contact</h2>
          <p>Pour exercer vos droits ou pour toute question, contactez notre DPO a : <strong>privacy@breezy.app</strong></p>
        </section>
      </div>
    </div>
  );
}
