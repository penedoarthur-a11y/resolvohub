import React from 'react';
import { Helmet } from 'react-helmet';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function PrivacidadePage() {
	return (
		<div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
			<Helmet>
				<title>Política de privacidade — Resolvo Já</title>
			</Helmet>
			<SiteHeader />

			<main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
				<h1 className="font-display text-3xl font-semibold">Política de privacidade</h1>
				<p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

				<div className="prose prose-invert mt-8 max-w-none space-y-6 text-[hsl(var(--muted-foreground))]">
					<p>
						Este documento é um modelo inicial de política de privacidade, alinhado à Lei Geral de
						Proteção de Dados (LGPD), e ainda não passou por revisão jurídica. Recomendamos revisão por um
						advogado antes de operar com clientes reais.
					</p>

					<section>
						<h2 className="text-foreground font-semibold text-lg">1. Dados que coletamos</h2>
						<p>
							Nome, e-mail e senha (no cadastro); dados da empresa e do problema descritos no briefing;
							dados de pagamento processados diretamente pela Stripe (não armazenamos número de cartão);
							e-mail de contato para a consultoria.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">2. Como usamos seus dados</h2>
						<p>
							Para gerar as prévias e soluções por IA, processar pagamentos, entrar em contato sobre
							pedidos e consultorias, e enviar comunicações relacionadas à sua conta.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">3. Compartilhamento</h2>
						<p>
							Compartilhamos dados apenas com prestadores necessários à operação do serviço: Stripe
							(pagamentos) e provedores de infraestrutura (hospedagem e banco de dados). Não vendemos
							seus dados.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">4. Seus direitos</h2>
						<p>
							Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento,
							escrevendo para contato@resolvoja.com.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">5. Segurança</h2>
						<p>
							Senhas são armazenadas de forma criptografada. O acesso a dados administrativos é
							restrito à equipe do Resolvo Já.
						</p>
					</section>

					<section>
						<h2 className="text-foreground font-semibold text-lg">6. Contato</h2>
						<p>Dúvidas sobre esta política: contato@resolvoja.com</p>
					</section>
				</div>
			</main>

			<SiteFooter />
		</div>
	);
}
