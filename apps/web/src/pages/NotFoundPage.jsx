import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function NotFoundPage() {
	return (
		<div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
			<Helmet>
				<title>Página não encontrada — Resolvo Já</title>
			</Helmet>
			<SiteHeader />

			<main className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
				<h1 className="font-display text-4xl font-semibold">404</h1>
				<p className="mt-4 text-[hsl(var(--muted-foreground))]">Essa página não existe ou foi movida.</p>
				<Link to="/" className="mt-8 inline-block rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90">
					Voltar para o início
				</Link>
			</main>

			<SiteFooter />
		</div>
	);
}
