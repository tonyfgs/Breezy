import { redirect } from 'next/navigation';

export default function HomePage() {
  // TODO: rediriger vers /login si non authentifié (AuthContext)
  redirect('/feed');
}
