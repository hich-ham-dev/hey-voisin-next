import { Skeleton } from '@heroui/react';
import { Post } from '@/core/domain/entities/Post';
import { PostCard } from './PostCard';

interface PostListProps {
	posts: Post[];
	isLoading?: boolean;
}

export const PostList = ({ posts, isLoading = false }: PostListProps) => {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, index) => (
					<Skeleton key={index} variant="rectangular" height={320} animation="wave" />
				))}
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="text-center py-10">
				<h4 className="text-lg font-medium text-gray-600">
					Aucune publication trouvée
				</h4>
				<p className="text-gray-500 mt-2">
					Essayez de modifier vos critères de recherche.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
};