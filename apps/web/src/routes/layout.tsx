import { component$, Slot } from '@builder.io/qwik';
import Footer from '~/components/Footer';
import 'virtual:uno.css';

export default component$(() => {
	return (
		<>
			<div style={{ minHeight: 'calc(100vh - 154px)' }}>
				<Slot />
			</div>
			<Footer />
		</>
	);
});
