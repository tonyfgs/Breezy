import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <Link href="/register" className="legal-page__back-arrow">&#8592; Retour</Link>

        <h1 className="legal-page__title">Conditions d'utilisation</h1>
        <p className="legal-page__date">Derniere mise a jour : juin 2025</p>

        <section className="legal-section">
          <h2>1. Acceptation des conditions</h2>
          <p>En accedant a Breezy, vous acceptez d'etre lie par ces conditions. Si vous n'acceptez pas ces conditions, vous ne pouvez pas utiliser le service.</p>
        </section>

        <section className="legal-section">
          <h2>2. Description du service</h2>
          <p>Breezy est une plateforme de microblogging permettant aux utilisateurs de publier des messages courts, de suivre d'autres utilisateurs et d'interagir avec leur contenu.</p>
        </section>

        <section className="legal-section">
          <h2>3. Compte utilisateur</h2>
          <p>Vous etes responsable de la confidentialite de votre compte et de toutes les activites qui s'y deroulent. Vous devez nous informer immediatement de toute utilisation non autorisee de votre compte.</p>
        </section>

        <section className="legal-section">
          <h2>4. Contenu utilisateur</h2>
          <p>Vous conservez vos droits sur le contenu que vous publiez. En publiant du contenu, vous accordez a Breezy une licence non exclusive pour afficher et distribuer ce contenu sur la plateforme.</p>
          <p>Il est interdit de publier du contenu illegal, diffamatoire, harcelant, ou portant atteinte aux droits de tiers.</p>
        </section>

        <section className="legal-section">
          <h2>5. Moderation</h2>
          <p>Breezy se reserve le droit de supprimer tout contenu ou de suspendre tout compte violant ces conditions, sans preavis.</p>
        </section>

        <section className="legal-section">
          <h2>6. Limitation de responsabilite</h2>
          <p>Breezy est fourni "tel quel" sans garantie d'aucune sorte. Nous ne saurions etre tenus responsables des dommages directs ou indirects resultant de l'utilisation du service.</p>
        </section>

        <section className="legal-section">
          <h2>7. Modification des conditions</h2>
          <p>Nous pouvons modifier ces conditions a tout moment. La poursuite de l'utilisation du service apres modification vaut acceptation des nouvelles conditions.</p>
        </section>

        <section className="legal-section">
          <h2>8. Contact</h2>
          <p>Pour toute question relative a ces conditions, contactez-nous a l'adresse : <strong>legal@breezy.app</strong></p>
        </section>
      </div>
    </div>
  );
}
