import { component$, Slot } from '@builder.io/qwik';
import Footer from '~/components/Footer';
import 'virtual:uno.css';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import Bg from '~/components/Bg';

export default component$(() => {
	const location = useLocation();
	const isB50 = location.url.pathname.startsWith('/b50');

	return (
		<>
			{isB50 && <Bg />}
			<div style={{ minHeight: 'calc(100vh - 154px)' }}>
				<Slot />
			</div>
			<Footer />
		</>
	);
});
