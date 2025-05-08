import {Author} from '@/core/domain/entities/Author';
import {Category} from '@/core/domain/entities/Category';
import {Post} from '@/core/domain/entities/Post';
import {User} from '@/core/domain/entities/User';

export class ApiClient {
	private readonly baseUrl: string;
	private readonly headers: HeadersInit;

	constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api') {
		this.baseUrl = baseUrl;
		this.headers = {
			'Content-Type': 'application/json',
		};
	}

	private async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	}

	// Users
	async getUser(id: string): Promise<User> {
		const response = await fetch(`${this.baseUrl}/users/${id}`, {
			headers: this.headers,
		});
		return this.handleResponse<User>(response);
	}

	async updateUser(id: string, userData: Partial<User>): Promise<User> {
		const response = await fetch(`${this.baseUrl}/users/${id}`, {
			method: 'PUT',
			headers: this.headers,
			body: JSON.stringify(userData),
		});
		return this.handleResponse<User>(response);
	}

	// Posts
	async getPosts(): Promise<Post[]> {
		const response = await fetch(`${this.baseUrl}/posts`, {
			headers: this.headers,
		});
		return this.handleResponse<Post[]>(response);
	}

	async createPost(postData: Omit<Post, 'id'>): Promise<Post> {
		const response = await fetch(`${this.baseUrl}/posts`, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify(postData),
		});
		return this.handleResponse<Post>(response);
	}

	async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
		const response = await fetch(`${this.baseUrl}/posts/${id}`, {
			method: 'PUT',
			headers: this.headers,
			body: JSON.stringify(postData),
		});
		return this.handleResponse<Post>(response);
	}

	async deletePost(id: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/posts/${id}`, {
			method: 'DELETE',
			headers: this.headers,
		});
		await this.handleResponse<void>(response);
	}

	// Categories
	async getCategories(): Promise<Category[]> {
		const response = await fetch(`${this.baseUrl}/categories`, {
			headers: this.headers,
		});
		return this.handleResponse<Category[]>(response);
	}

	async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
		const response = await fetch(`${this.baseUrl}/categories`, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify(categoryData),
		});
		return this.handleResponse<Category>(response);
	}

	// Authors
	async getAuthor(id: string): Promise<Author> {
		const response = await fetch(`${this.baseUrl}/authors/${id}`, {
			headers: this.headers,
		});
		return this.handleResponse<Author>(response);
	}

	async updateAuthor(id: string, authorData: Partial<Author>): Promise<Author> {
		const response = await fetch(`${this.baseUrl}/authors/${id}`, {
			method: 'PUT',
			headers: this.headers,
			body: JSON.stringify(authorData),
		});
		return this.handleResponse<Author>(response);
	}
}