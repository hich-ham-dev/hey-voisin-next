'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem, Spinner } from '@heroui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Category } from '@/core/domain/entities/Category';
import { City } from '@/core/domain/entities/City';
import { ApiClient } from '@infrastructure/api/ApiClient';
import { ApiCategoryRepository } from '@/infrastructure/repositories/ApiCategoryRepository';
import { ApiCityRepository } from '@/infrastructure/repositories/ApiCityRepository';
import { GetCategoriesUseCase } from '@core/application/useCases/category/GetCategoriesUseCase';

interface AdvancedSearchBarProps {
    onSearch: (query: string, categoryId?: string, cityId?: string) => void;
    placeholder?: string;
}

export const AdvancedSearchBar = ({ onSearch, placeholder = 'Rechercher...' }: AdvancedSearchBarProps) => {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [cityQuery, setCityQuery] = useState('');
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    useEffect(() => {
        // Charger les catégories
        const loadCategories = async () => {
            try {
                const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
                const categoryRepository = new ApiCategoryRepository(apiClient);
                const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);

                const categoriesData = await getCategoriesUseCase.execute();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Erreur lors du chargement des catégories', error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        loadCategories();
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query, selectedCategory || undefined, selectedCity || undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    endDecorator={
                        <Button type="submit" variant="text" color="neutral">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </Button>
                    }
                    fullWidth
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Select
                        placeholder="Toutes les catégories"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as string)}
                        disabled={isLoadingCategories}
                        startDecorator={isLoadingCategories ? <Spinner size="sm" /> : null}
                    >
                        <SelectItem value="">Toutes les catégories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                <div className="relative">
                    <Input
                        value={cityQuery}
                        onChange={(e) => setCityQuery(e.target.value)}
                        placeholder="Rechercher une ville..."
                        endDecorator={isLoadingCities ? <Spinner size="sm" /> : null}
                        fullWidth
                    />
                    {cityQuery.length >= 2 && cities.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {cities.map((city) => (
                                <div
                                    key={city.id}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setSelectedCity(city.id);
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

            <div className="flex justify-end">
                <Button type="submit" color="primary" loading={isLoadingCities}>
                    Rechercher
                </Button>
            </div>
        </form>
    );
};