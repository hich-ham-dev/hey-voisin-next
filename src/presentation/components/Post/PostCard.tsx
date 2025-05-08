import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from '@heroui/avatar';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Post } from '@/core/domain/entities/Post';

interface PostCardProps {
	post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
	const formattedDate = new Date(post.createdAt).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

	const authorName = `${post.author.firstName} ${post.author.lastName}`;
	const avatarUrl = post.author.avatarUrl || '/images/default-avatar.png';

	return (
		<Card className="h-full flex flex-col">
			{post.imageUrl && (
				<div className="w-full h-48 relative">
					<Image
						src={post.imageUrl}
						alt={post.title}
						fill
						className="object-cover"
					/>
				</div>
			)}

			<CardHeader className="flex justify-between items-start">
				<h3 className="text-xl font-medium">{post.title}</h3>
				{post.category && (
					<Chip color="primary" size="sm">
						{post.category.name}
					</Chip>
				)}
			</CardHeader>

			<CardBody className="flex-grow">
				<p className="text-md line-clamp-3">
					{post.content}
				</p>
			</CardBody>

			<CardFooter className="flex flex-col gap-3">
				<div className="flex items-center w-full">
					<Avatar src={avatarUrl} alt={authorName} size="sm" />
					<div className="ml-2">
						<p className="text-sm font-medium">{authorName}</p>
						<div className="flex items-center">
                            <span className="text-xs text-gray-500">
                                {formattedDate}
                            </span>
							{post.city && (
								<span className="text-xs text-gray-500 ml-2 pl-2 border-l border-gray-300">
                                    {post.city.name}
                                </span>
							)}
						</div>
					</div>
				</div>

				<Link href={`/posts/${post.id}`} className="self-end">
                    <span
											className="text-sm font-medium text-blue-600 hover:underline"
										>
                        Lire la suite
                    </span>
				</Link>
			</CardFooter>
		</Card>
	);
};