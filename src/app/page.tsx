'use client';

import { Suspense } from 'react';
import { AdvancedSearchBar } from '@/presentation/components/SearchBar/AdvancedSearchBar';
import { PostList } from '@/presentation/components/Post/PostList';
import { GetPostsUseCase } from '@/core/application/useCases/post/GetPostsUseCase';
import { ApiPostRepository } from '@/infrastructure/repositories/ApiPostRepository';
import { ApiClient } from '@infrastructure/api/ApiClient';

// Cette fonction pourrait être remplacée par un DI container dans un projet plus complexe
const createGetPostsUseCase = () => {
  const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
  const postRepository = new ApiPostRepository(apiClient);
  return new GetPostsUseCase(postRepository);
};

async function PostsContent() {
  const getPostsUseCase = createGetPostsUseCase();
  const posts = await getPostsUseCase.execute();

  return <PostList posts={posts} />;
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Découvrez votre voisinage
      </h1>

      <Card className="mb-8">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            Rechercher
          </h2>
          <AdvancedSearchBar
            onSearch={(query, categoryId, cityId) => {
              // Cette partie sera implémentée avec client components
              console.log('Recherche:', { query, categoryId, cityId });
            }}
            placeholder="Que recherchez-vous dans votre quartier ?"
          />
        </div>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Publications récentes
        </h2>
        <Suspense fallback={<PostList posts={[]} isLoading={true} />}>
          <PostsContent />
        </Suspense>
      </section>
    </main>
  );
}