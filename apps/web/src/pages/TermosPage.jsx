import React from 'react';
import { Helmet } from 'react-helmet';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function TermosPage() {
	return (
		<div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
			<Helmet>
				<title>Termos de uso — Resolvo Já</title>
			</Helmet>
			<SiteHeader />

			<main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
				<h1 className="font-display text-3xl font-semibold">Termos de uso</h1>
				<p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

				<div className="prose prose-invert mt-8 max-w-none space-y-6 text-[hsl(var(--muted-foreground))]">
					<p>
						Este documento é um modelo inicial de Termos de Uso e ainda não passou por revisão jurídica.
						Antes de operar com clientes reais, recomendamos revisão por um advogado — em especial para
						confirmar a razão social, CNPJ e política de reembolso do negócio.
					</p>

					<section>
						<h2 className="text-foreground font-semibold text-lg">1. Sobre o serviço</h2>
						<p>
							O Resolvo Já é uma plataforma que gera prévias de soluções de negócio por Inteligência
							Artificial a partir de um briefing preenchido pelo usuário, e oferece o desenvolvimento da
							solução completa por assinatura (planos Essencial e Pro) ou compra avulsa, além de sessões
							de consultoria com especialistas humanos.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">2. Cadastro e conta</h2>
						<p>
							Para usar o serviço, você precisa criar uma conta com e-mail e senha válidos. Você é
							responsável por manter a confidencialidade da sua senha e por toda atividade realizada na
							sua conta.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">3. Assinaturas e pagamentos</h2>
						<p>
							Os pagamentos são processados pela Stripe. Assinaturas são cobradas de forma recorrente
							(mensal) até que sejam canceladas pelo próprio usuário no portal de gerenciamento de
							assinatura. Compras avulsas e de consultoria são cobradas uma única vez.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">4. Cancelamento e reembolso</h2>
						<p>
							Assinaturas podem ser canceladas a qualquer momento; o acesso permanece ativo até o fim do
							período já pago. Reembolsos são avaliados caso a caso — entre em contato pelo e-mail
							abaixo.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">5. Uso aceitável</h2>
						<p>
							Você concorda em não usar o serviço para fins ilegais, nem tentar acessar dados de outros
							usuários ou áreas administrativas sem autorização.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">6. Alterações</h2>
						<p>
							Podemos atualizar estes termos periodicamente. Mudanças relevantes serão comunicadas por
							e-mail ou aviso no site.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">7. Contato</h2>
						<p>Dúvidas sobre estes termos: contato@resolvoja.com</p>
					</section>
				</div>
			</main>

			<SiteFooter />
		</div>
	);
}
