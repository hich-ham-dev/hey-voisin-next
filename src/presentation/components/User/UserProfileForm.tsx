'use client';

import { useState, useEffect, useRef } from 'react';
import {
	Avatar,
	Button,
	Input,
	Card,
	Divider,
	Spinner,
	Alert,
	Skeleton
} from '@heroui/react';
import { User } from '@core/domain/entities/User';
import { ApiClient } from '@infrastructure/api/ApiClient';
import { ApiUserRepository } from '@infrastructure/repositories/ApiUserRepository';
import { GetUserProfileUseCase } from '@core/application/useCases/user/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '@core/application/useCases/user/UpdateUserProfileUseCase';
import { UpdateUserAvatarUseCase } from '@core/application/useCases/user/UpdateUserAvatarUseCase';
import { City } from '@core/domain/entities/City';
import { ApiCityRepository } from '@infrastructure/repositories/ApiCityRepository';

export const UserProfileForm = () => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState<Partial<User>>({});
	const [message, setMessage] = useState({ text: '', type: '' });
	const [cityQuery, setCityQuery] = useState('');
	const [cities, setCities] = useState<City[]>([]);
	const [isLoadingCities, setIsLoadingCities] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
			const userRepository = new ApiUserRepository(apiClient);
			const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

			try {
				const userData = await getUserProfileUseCase.execute();
				setUser(userData);
				if (userData) {
					setFormData({
						firstName: userData.firstName,
						lastName: userData.lastName,
						email: userData.email,
						username: userData.username,
						city: userData.city
					});

					// Si l'utilisateur a une ville, on initialise la recherche
					if (userData.city) {
						setCityQuery(`${userData.city.name} (${userData.city.zipCode})`);
					}
				}
			} catch (error) {
				setMessage({ text: 'Erreur lors du chargement du profil', type: 'error' });
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, []);

	useEffect(() => {
		// Recherche des villes avec debounce
		const timer = setTimeout(() => {
			if (cityQuery.length >= 2) {
				searchCities(cityQuery);
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [cityQuery]);

	const searchCities = async (query: string) => {
		if (query.length < 2) return;

		setIsLoadingCities(true);
		try {
			const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
			const cityRepository = new ApiCityRepository(apiClient);
			const citiesData = await cityRepository.getCities(query);
			setCities(citiesData);
		} catch (error) {
			console.error('Erreur lors de la recherche des villes', error);
		} finally {
			setIsLoadingCities(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setIsSaving(true);
		setMessage({ text: '', type: '' });

		try {
			const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
			const userRepository = new ApiUserRepository(apiClient);
			const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);

			const updatedUser = await updateUserProfileUseCase.execute(user.id, formData);
			setUser(updatedUser);
			setMessage({ text: 'Profil mis à jour avec succès', type: 'success' });
		} catch (error) {
			setMessage({ text: 'Erreur lors de la mise à jour du profil', type: 'error' });
		} finally {
			setIsSaving(false);
		}
	};

	const handleAvatarClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!user || !e.target.files || e.target.files.length === 0) return;

		const file = e.target.files[0];
		if (!file.type.startsWith('image/')) {
			setMessage({ text: 'Veuillez sélectionner une image', type: 'error' });
			return;
		}

		setIsSaving(true);
		setMessage({ text: '', type: '' });

		try {
			const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
			const userRepository = new ApiUserRepository(apiClient);
			const updateUserAvatarUseCase = new UpdateUserAvatarUseCase(userRepository);

			const updatedUser = await updateUserAvatarUseCase.execute(user.id, file);
			setUser(updatedUser);
			setMessage({ text: 'Avatar mis à jour avec succès', type: 'success' });
		} catch (error) {
			setMessage({ text: 'Erreur lors de la mise à jour de l\'avatar', type: 'error' });
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return <Skeleton variant="rectangular" height={600} animation="wave" />;
	}

	if (!user) {
		return (
			<Alert color="danger">
				Utilisateur non trouvé ou non connecté.
			</Alert>
		);
	}

	const avatarUrl = user.avatar?.filePath || '/images/default-avatar.png';

	return (
		<Card>
			<div sx={{ p: 3 }}>
				<div className="flex items-center mb-4">
					<div className="mr-4 cursor-pointer relative group" onClick={handleAvatarClick}>
						<Avatar
							src={avatarUrl}
							alt={`${user.firstName} ${user.lastName}`}
							size="lg"
							className="transition-all hover:opacity-70"
						/>
						<div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-white">
                Modifier
              </span>
						</div>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleAvatarChange}
							className="hidden"
							accept="image/*"
						/>
					</div>
					<div>
						<h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
						<p className="text-sm text-gray-500">
							Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}
						</p>
					</div>
				</div>

				{message.text && (
					<Alert
						color={message.type === 'error' ? 'danger' : 'success'}
						className="mb-4"
					>
						{message.text}
					</Alert>
				)}

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Prénom
							</label>
							<Input
								name="firstName"
								value={formData.firstName || ''}
								onChange={handleInputChange}
								fullWidth
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Nom
							</label>
							<Input
								name="lastName"
								value={formData.lastName || ''}
								onChange={handleInputChange}
								fullWidth
							/>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Nom d'utilisateur
						</label>
						<Input
							name="username"
							value={formData.username || ''}
							onChange={handleInputChange}
							fullWidth
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<Input
							type="email"
							name="email"
							value={formData.email || ''}
							onChange={handleInputChange}
							fullWidth
						/>
					</div>

					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Ville
						</label>
						<div className="relative">
							<Input
								value={cityQuery}
								onChange={(e) => setCityQuery(e.target.value)}
								placeholder="Rechercher une ville..."
								endDecorator={isLoadingCities ? <Spinner size="sm" /> : null}
								fullWidth
							/>
							{cityQuery.length >= 2 && cities.length > 0 && (
								<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
									{cities.map((city) => (
										<div
											key={city.id}
											className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
											onClick={() => {
												setFormData({
													...formData,
													city: city
												});
												setCityQuery(`${city.name} (${city.zipCode})`);
											}}
										>
											{city.name} ({city.zipCode})
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<Divider />

					<div className="flex justify-end mt-4">
						<Button
							type="submit"
							color="primary"
							loading={isSaving}
						>
							Enregistrer les modifications
						</Button>
					</div>
				</form>
			</div>
		</Card>
	);
};