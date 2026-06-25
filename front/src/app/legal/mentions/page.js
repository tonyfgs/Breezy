import Link from 'next/link';

export default function MentionsPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <Link href="/login" className="legal-page__back-arrow">&#8592; Retour</Link>

        <h1 className="legal-page__title">Mentions légales</h1>
        <p className="legal-page__date">Dernière mise à jour : juin 2025</p>

        <section className="legal-section">
          <h2>Éditeur du site</h2>
          <p><strong>Breezy</strong></p>
          <p>Projet académique réalisé dans le cadre du cursus Développement d'Applications Distribuées.</p>
          <p>Contact : <strong>contact@breezy.app</strong></p>
        </section>

        <section className="legal-section">
          <h2>Hébergement</h2>
          <p>Le service est hébergé localement à des fins de développement et d'évaluation académique. Aucun hébergement commercial n'est utilisé dans le cadre de ce projet.</p>
        </section>

        <section className="legal-section">
          <h2>Propriété intellectuelle</h2>
          <p>L'ensemble des éléments constituant le site Breezy (logo, design, code source) est la propriété exclusive de ses auteurs. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite est interdite.</p>
        </section>

        <section className="legal-section">
          <h2>Données personnelles</h2>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), les utilisateurs disposent d'un droit d'accès, de rectification et de suppression de leurs données personnelles.</p>
          <p>Pour exercer ces droits : <strong>privacy@breezy.app</strong></p>
          <p>Pour en savoir plus, consultez notre <Link href="/legal/privacy" style={{ color: 'var(--color-primary)' }}>Politique de confidentialité</Link>.</p>
        </section>

        <section className="legal-section">
          <h2>Cookies</h2>
          <p>Breezy utilise uniquement un cookie technique nécessaire au fonctionnement du service (authentification). Aucun cookie publicitaire ou de traçage tiers n'est utilisé.</p>
        </section>

        <section className="legal-section">
          <h2>Limitation de responsabilité</h2>
          <p>Les informations contenues sur ce site sont aussi précises que possible. Breezy ne saurait être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour des informations.</p>
        </section>

        <section className="legal-section">
          <h2>Droit applicable</h2>
          <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </section>
      </div>
    </div>
  );
}
