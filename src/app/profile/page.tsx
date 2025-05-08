import { UserProfileForm } from '@/presentation/components/User/UserProfileForm';

export default function ProfilePage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">
				Mon profil
			</h1>
			<UserProfileForm />
		</main>
	);
}